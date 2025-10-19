import { canUserEditLab } from "@/data/dto/auth/lab-permissions";
import dbConnect from "@/lib/data/mongodb/connections";
import { ExperienceModel } from "@/lib/data/mongodb/models/experience-model";
import { uploadFile } from "@/lib/data/uploader/s3";
import { uploadFileToPublicFolder } from "@/lib/data/uploader/server-store";
import {
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
