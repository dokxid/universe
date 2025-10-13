"use server";

import { editLabVisibilityDTO } from "@/data/dto/experience-dto";

export async function editLabVisibilityFormAction(formData: FormData) {
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
