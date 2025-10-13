import "server-only";

import { isUserAdmin } from "@/data/auth";
import {
    getExperience,
    getExperiences,
    getLabByObjectId,
} from "@/data/fetcher/experience-fetcher";
import experienceModel from "@/lib/data/mongodb/models/experience-model";
import { ExperienceDTO } from "@/types/dtos";
import { editVisibilityFormSchema } from "@/types/form-schemas";
import { revalidateTag } from "next/cache";
import { cache } from "react";
import z from "zod";

async function canUserManageLab(slug: string): Promise<boolean> {
    try {
        return isUserAdmin(slug);
    } catch (error) {
        console.error("Error checking if user can manage lab:", error);
        return false;
    }
}

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
        const experience = await experienceModel.findOne({
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
        const experience = await experienceModel.findOne({ slug: slug });
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

export async function editLabVisibilityDTO(formData: FormData) {
    try {
        // check permissions of user
        const slug = formData.get("slug") as string;
        const labDTO = await getExperienceDTO(slug);
        if (!labDTO) {
            throw new Error(`Lab not found for slug: ${slug}`);
        }
        const isAllowedToEdit = await canUserManageLab(labDTO.slug);
        if (!isAllowedToEdit) {
            throw new Error("You do not have permission to edit this lab.");
        }

        // validate form data
        const rawData = Object.fromEntries(formData.entries());
        const result = editVisibilityFormSchema.safeParse(rawData);
        if (!result.success) {
            throw new Error(JSON.stringify(z.flattenError(result.error)));
        }

        // update database
        console.log("Updating lab visibility:", result.data);
        const mutate = await experienceModel.updateOne(
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
