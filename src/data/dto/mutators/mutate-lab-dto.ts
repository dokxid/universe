import {
    canUserCreateLab,
    canUserEditLab,
} from "@/data/dto/auth/lab-permissions";
import {
    createOrganization,
    inviteLabAdmin,
} from "@/lib/auth/workos/invitation";
import dbConnect from "@/lib/data/mongodb/connections";
import { ExperienceModel } from "@/lib/data/mongodb/models/experience-model";
import { uploadFile } from "@/lib/data/uploader/s3";
import { uploadFileToPublicFolder } from "@/lib/data/uploader/server-store";
import {
    createLabFormSchema,
    editLabAppearanceSchema,
    editLabImageFormSchema,
    editVisibilityFormSchema,
} from "@/types/form-schemas/lab-form-schemas";
import { revalidateTag } from "next/cache";
import z from "zod";

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
        revalidateTag(`labs/${data.lab}`);
        return { success: true };
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}

export async function editLabVisibilityDTO(
    formData: FormData
): Promise<{ success: boolean; error?: string }> {
    try {
        // check permissions of user
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
        const data = result.data;

        // update database
        const mutate = await ExperienceModel.updateOne(
            { slug: data.lab },
            {
                $set: {
                    visibility: data.visibility,
                },
            }
        );
        if (mutate.modifiedCount === 0) {
            throw new Error("No changes made.");
        }

        // revalidate cache
        revalidateTag(`labs/${data.lab}`);
        return { success: true };
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}

export async function editLabAppearanceDTO(formData: FormData) {
    try {
        // check permissions of user
        const isAllowedToEdit = await canUserEditLab(
            formData.get("lab") as string
        );
        if (!isAllowedToEdit) {
            throw new Error("User is not allowed to edit this lab");
        }

        // validate form data
        const rawData = Object.fromEntries(formData.entries());
        const result = editLabAppearanceSchema.safeParse(rawData);
        if (!result.success) {
            throw new Error(JSON.stringify(z.flattenError(result.error)));
        }
        const data = result.data;

        // update database
        const mutate = await ExperienceModel.updateOne(
            { slug: data.lab },
            {
                $set: {
                    title: data.title,
                    subtitle: data.subtitle,
                    description: data.description,
                    subdomain: data.subdomain,
                },
            }
        );
        if (mutate.modifiedCount === 0) {
            throw new Error("No changes made.");
        }

        // revalidate cache
        revalidateTag(`labs/${data.lab}`);
        return {
            result: { success: true },
            redirect: `/${data.subdomain}/lab/settings`,
        };
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}

export async function createLabDTO(formData: FormData) {
    try {
        const isAllowedToCreateLab = await canUserCreateLab();
        if (!isAllowedToCreateLab) {
            throw new Error("User is not allowed to create a lab");
        }

        const rawData = Object.fromEntries(formData.entries());
        const processedData = {
            ...rawData,
            longitude: parseFloat(rawData.longitude as string),
            latitude: parseFloat(rawData.latitude as string),
            initialZoom: Number(rawData.initialZoom),
        };
        const result = createLabFormSchema.safeParse(processedData);
        if (!result.success) {
            throw new Error(JSON.stringify(z.flattenError(result.error)));
        }
        const { longitude, latitude, adminEmail, image, ...rest } = result.data;
        if (!image) {
            throw new Error("No lab picture provided");
        }

        console.log("Inviting admin:", adminEmail, "to lab:", rest.slug);
        const organizationId = await createOrganization(rest.slug);
        await inviteLabAdmin(adminEmail, rest.slug);

        let path: string;
        if (process.env.LOCAL_UPLOADER === "true") {
            path = await uploadFileToPublicFolder(image, rest.slug);
        } else {
            path = await uploadFile(image, rest.slug);
        }

        const data = {
            featuredImageUrl: path,
            organizationId,
            center: {
                type: "Point",
                coordinates: [longitude, latitude],
            },
            ...rest,
        };
        ExperienceModel.insertOne(data);
        console.log("Validated data:", data);
        return { success: true, error: undefined };
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}
