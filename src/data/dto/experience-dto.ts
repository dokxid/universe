import "server-only";

import { canUserEditLab } from "@/data/auth/lab-permissions";
import {
    getExperience,
    getExperiences,
    getLabByObjectId,
} from "@/data/fetcher/experience-fetcher";
import dbConnect from "@/lib/data/mongodb/connections";
import { ExperienceModel } from "@/lib/data/mongodb/models/experience-model";
import { uploadFile } from "@/lib/data/uploader/s3";
import { uploadFileToPublicFolder } from "@/lib/data/uploader/server-store";
import { ExperienceDTO } from "@/types/dtos";
import {
    editLabImageFormSchema,
    editVisibilityFormSchema,
} from "@/types/form-schemas/lab-form-schemas";
import { revalidateTag } from "next/cache";
import { cache } from "react";
import z from "zod";

export const getExperiencesDTO = cache(async (): Promise<ExperienceDTO[]> => {
    try {
        const labs = await getExperiences();
        const sanitizedLabs: ExperienceDTO[] = labs.map((lab) => ({
            ...lab,
            amountStories: lab.stories.length,
        }));
        return sanitizedLabs;
    } catch (err) {
        throw new Error(
            "Error fetching experiences: " +
                (err instanceof Error ? err.message : "Unknown error")
        );
    }
});

export const getPublicLabsDTO = cache(async (): Promise<ExperienceDTO[]> => {
    try {
        const experiences = await getExperiences();
        const sanitizedExperiences: ExperienceDTO[] = experiences.map(
            (exp) => ({ ...exp, amountStories: exp.stories.length })
        );
        return sanitizedExperiences.filter(
            (exp) => exp.visibility === "public"
        );
    } catch (err) {
        throw new Error(
            "Error fetching public labs: " +
                (err instanceof Error ? err.message : "Unknown error")
        );
    }
});

export async function getExperienceDTO(
    experienceSlug: string
): Promise<ExperienceDTO> {
    try {
        const lab = await getExperience(experienceSlug);
        const sanitizedLab: ExperienceDTO = {
            ...lab,
            amountStories: lab.stories.length,
        };
        return sanitizedLab;
    } catch (err) {
        throw new Error(
            `Error fetching experience ${experienceSlug}: ${
                err instanceof Error ? err.message : "Unknown error"
            }`
        );
    }
}

export async function getLabByObjectIdDTO(
    labId: string
): Promise<ExperienceDTO> {
    try {
        const lab = await getLabByObjectId(labId);
        const sanitizedLab: ExperienceDTO = {
            ...lab,
            amountStories: lab.stories.length,
        };
        if (!lab) {
            throw new Error(`Lab not found for ID: ${labId}`);
        }
        return sanitizedLab;
    } catch (err) {
        throw new Error(
            `Error fetching lab by ID ${labId}: ${
                err instanceof Error ? err.message : "Unknown error"
            }`
        );
    }
}

export async function getExperienceSignInDTO(experienceSlug: string) {
    try {
        const experience = await getExperience(experienceSlug);
        return {
            organization_id: experience.organizationId,
            connection_id: experience.connection_id,
        };
    } catch (err) {
        throw new Error(
            `Error fetching experience ${experienceSlug}: ${
                err instanceof Error ? err.message : "Unknown error"
            }`
        );
    }
}

export async function getSlugFromOrganizationIdDTO(
    organizationId: string
): Promise<string | null> {
    try {
        const experience = await ExperienceModel.findOne({
            organizationId: organizationId,
        });
        if (!experience) {
            throw new Error(
                `No experiences found for organization ID: ${organizationId}`
            );
        }
        if (!experience?.slug) {
            throw new Error(
                `Could not find experience for organization ID: ${organizationId}`
            );
        }
        return experience.slug;
    } catch (err) {
        console.error("Error fetching slug from organization ID:", err);
        return null;
    }
}

export async function getOrganizationFromSlugDTO(
    slug: string
): Promise<{ organizationId: string }> {
    try {
        const experience = await ExperienceModel.findOne({ slug: slug });
        if (!experience) {
            throw new Error(`No experiences found for slug: ${slug}`);
        }
        if (!experience?.organizationId) {
            throw new Error(`Could not find organization for slug: ${slug}`);
        }
        return { organizationId: experience.organizationId };
    } catch (err) {
        throw new Error(
            `Error fetching organization from slug ${slug}: ${
                err instanceof Error ? err.message : "Unknown error"
            }`
        );
    }
}

export async function editLabPictureDTO(formData: FormData) {
    try {
        const isAllowedToEdit = await canUserEditLab(
            formData.get("lab") as string
        );
        if (!isAllowedToEdit) {
            throw new Error("User is not allowed to edit this lab");
        }
        const rawData = Object.fromEntries(formData);
        const result = editLabImageFormSchema.safeParse(rawData);
        if (!result.success) {
            throw new Error(z.prettifyError(result.error));
        }
        const { image } = result.data;
        if (!image) {
            throw new Error("No lab picture provided");
        }
        const data = result.data;

        let path: string;
        if (process.env.LOCAL_UPLOADER === "true") {
            path = await uploadFileToPublicFolder(image, data.lab);
        } else {
            path = await uploadFile(image, data.lab);
        }

        // update the story's featured image URL in the database
        await dbConnect();
        await ExperienceModel.updateOne(
            { slug: data.lab },
            {
                $set: {
                    featured_image_url: path,
                    updatedAt: new Date(),
                },
            }
        );

        // revalidate caches
        revalidateTag(`labs`);
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}

export async function editLabVisibilityDTO(formData: FormData) {
    try {
        // check permissions of user
        const slug = formData.get("slug") as string;
        const labDTO = await getExperienceDTO(slug);
        if (!labDTO) {
            throw new Error(`Lab not found for slug: ${slug}`);
        }
        const isAllowedToEdit = await canUserEditLab(
            formData.get("lab") as string
        );
        if (!isAllowedToEdit) {
            throw new Error("User is not allowed to edit this lab");
        }

        // validate form data
        const rawData = Object.fromEntries(formData.entries());
        const result = editVisibilityFormSchema.safeParse(rawData);
        if (!result.success) {
            throw new Error(JSON.stringify(z.flattenError(result.error)));
        }

        // update database
        console.log("Updating lab visibility:", result.data);
        const mutate = await ExperienceModel.updateOne(
            { slug: result.data.slug },
            {
                $set: {
                    visibility: result.data.visibility,
                },
            }
        );
        if (mutate.modifiedCount === 0) {
            return {
                success: false,
                error: JSON.stringify({
                    formErrors: ["No changes made."],
                    fieldErrors: {},
                }),
            };
        }

        // revalidate cache
        revalidateTag(slug);
        return { success: true };
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}
