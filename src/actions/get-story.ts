"use server";

import { getStoryDTO } from "@/data/dto/getters/get-story-dto";
import { StoryDTO } from "@/types/dtos";

export async function getStoryAction(
    storyId: string
): Promise<StoryDTO | null> {
    try {
        const story = await getStoryDTO(storyId);
        return story;
    } catch (error) {
        console.error("Error fetching lab:", error);
        throw new Error("Failed to fetch lab data");
    }
}
