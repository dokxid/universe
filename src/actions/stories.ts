"use server";

import {
    editContentFormSchemaDTO,
    editStoryCoordinatesFormSchemaDTO,
    editStoryFeaturedPictureDTO,
    editStoryFormSchemaDTO,
    editVisibilityAndLicensingFormSchemaDTO,
    submitStoryDTO,
} from "@/data/dto/story-dto";

export async function submitStoryAction(formData: FormData) {
    try {
        await submitStoryDTO(formData);
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
        await editStoryFeaturedPictureDTO(formData);
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
        await editContentFormSchemaDTO(formData);
        return { success: true };
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
