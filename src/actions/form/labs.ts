"use server";

import {
    createLabDTO,
    editLabAppearanceDTO,
    editLabPictureDTO,
    editLabVisibilityDTO,
} from "@/data/dto/mutators/mutate-lab-dto";

export async function editLabPictureAction(formData: FormData) {
    try {
        await editLabPictureDTO(formData);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
export async function editLabVisibilityAction(formData: FormData) {
    try {
        const result = await editLabVisibilityDTO(formData);
        return result;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

export async function editLabAppearanceAction(formData: FormData): Promise<{
    result: { success: boolean; error?: string };
    redirect?: string;
}> {
    try {
        const { result, redirect } = await editLabAppearanceDTO(formData);
        return { result, redirect };
    } catch (error) {
        return {
            result: {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            },
        };
    }
}

export async function createLabFormAction(formData: FormData) {
    try {
        const result = await createLabDTO(formData);
        return result;
    } catch (error) {
        console.error("Error in createLabFormAction:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
