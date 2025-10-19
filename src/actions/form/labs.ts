"use server";

import { editLabPictureDTO } from "@/data/dto/experience-dto";

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
