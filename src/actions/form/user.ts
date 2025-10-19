"use server";

import {
    editDisplayNameFormSchemaDTO,
    editUserDetailsFormSchemaDTO,
    editUserProfilePictureFormSchemaDTO,
} from "@/data/dto/mutators/mutate-user-dto";

export async function editDisplayNameFormAction(formData: FormData) {
    try {
        await editDisplayNameFormSchemaDTO(formData);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

export async function editUserDetailsFormAction(formData: FormData) {
    try {
        await editUserDetailsFormSchemaDTO(formData);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

export async function editUserProfilePictureAction(formData: FormData) {
    try {
        await editUserProfilePictureFormSchemaDTO(formData);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
