"use server"

import { removeUserDTO, removeUserFromLabDTO } from "@/data/dto/mutators/mutate-user-dto";

export const removeUserFromLabAction = async (userId: string, labSlug: string) => {
    try {
        const result = await removeUserFromLabDTO(userId, labSlug);
        if (!result) throw new Error("Failed to remove user from lab");
        return { success: true, message: `${result.member.id} removed from lab successfully` }
    } catch (error) {
        console.error("Error removing user:", error);
        return { success: false, message: error instanceof Error ? error.message : "Unknown error" }
    }
}

export const removeUserAction = async (formData: FormData) => {
    try {
        const result = await removeUserDTO(formData);
        if (!result) throw new Error("Failed to remove user");
        return { success: true, error: null }
    } catch (error) {
        console.error("Error removing user:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
}
