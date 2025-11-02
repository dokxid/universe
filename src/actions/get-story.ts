"use server";

import { getAllPublicStoriesDTO, getLabPublicStoriesDTO, getStoryDTO } from "@/data/dto/getters/get-story-dto";
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

export async function getAllLabStoriesAction(
    slug: string
): Promise<StoryDTO[] | null> {
    try {
        if (slug === "universe") {
            return getAllPublicStoriesDTO();
        }
        const story = await getLabPublicStoriesDTO(slug);
        return story;
    } catch (error) {
        console.error("Error fetching lab:", error);
        throw new Error("Failed to fetch lab data");
    }
}
