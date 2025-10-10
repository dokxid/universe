"use server";

import { getCurrentUser } from "@/data/auth";
import {
    canUserCreateStory,
    editContentFormSchemaDTO,
    editStoryCoordinatesFormSchemaDTO,
    editStoryFeaturedPictureDTO,
    editStoryFormSchemaDTO,
    editVisibilityAndLicensingFormSchemaDTO,
    submitStoryDTO,
} from "@/data/dto/story-dto";

export async function submitStoryAction(formData: FormData) {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("You must be logged in to submit a story.");
        if (
            (await canUserCreateStory(user, formData.get("slug") as string)) ===
            false
        ) {
            throw new Error("You do not have permission to submit a story.");
        }
        await submitStoryDTO(formData)
            .then((msg) => {
                return msg;
            })
            .catch((error) => {
                throw new Error(JSON.stringify(error));
            });
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

export async function editStoryFeaturedPictureAction(formData: FormData) {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("You must be logged in to edit a story.");
        await editStoryFeaturedPictureDTO(formData)
            .then(() => {
                return;
            })
            .catch((error) => {
                throw new Error(JSON.stringify(error));
            });
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

export async function editStoryContentAction(formData: FormData) {
    try {
        await editContentFormSchemaDTO(formData)
            .then(() => {
                return;
            })
            .catch((error) => {
                throw new Error(JSON.stringify(error));
            });
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

export async function editStoryFormAction(formData: FormData) {
    try {
        await editStoryFormSchemaDTO(formData);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

export async function editVisibilityAndLicensingFormAction(formData: FormData) {
    try {
        await editVisibilityAndLicensingFormSchemaDTO(formData);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

export async function editStoryCoordinatesFormAction(formData: FormData) {
    try {
        await editStoryCoordinatesFormSchemaDTO(formData);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
