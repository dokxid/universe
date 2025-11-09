"use server";

import { editLabVisibilityDTO, removeLabDTO } from "@/data/dto/mutators/mutate-lab-dto";
import { LabVisibility } from "@/generated/prisma/enums";

export const setLabVisibilityAction = async (slug: string, visibility: LabVisibility) => {
    try {
        const formData = new FormData();
        formData.append("lab", slug);
        formData.append("visibility", visibility as string);
        const result = await editLabVisibilityDTO(formData);
        if (!result) throw new Error("Failed to set labs' visibility");
        return { success: true, error: null };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
export const removeLabAction = async (slug: string) => {
    try {
        const result = await removeLabDTO(slug);
        if (!result) throw new Error("Failed to remove lab");
        return { success: true, error: null };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
