"use server"

import { setDraftDTO, setVisibilityDTO } from "@/data/dto/mutators/mutate-story-dto";

export const setDraftAction = async (storyId: string, draft: boolean) => {
    try {
        const result = await setDraftDTO(storyId, draft);
        if (!result) throw new Error("Failed to set draft status");
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

export const setVisibilityAction = async (storyId: string, visibility: boolean) => {
    try {
        const result = await setVisibilityDTO(storyId, visibility);
        if (!result) throw new Error("Failed to set stories' visibility");
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
