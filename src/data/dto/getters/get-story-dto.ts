import "server-only";

import { getCurrentUser, isUserMember, isUserSuperAdmin } from "@/data/auth";
import { canUserViewStory } from "@/data/dto/auth/story-permissions";
import {
    getAllStories,
    getAllStoryPins,
    getStoriesByUser,
    queryStory,
} from "@/data/fetcher/story-fetcher";
import { StoryDTO, StoryPinDTO } from "@/types/dtos";

export async function getAllPublicStoriesDTO(): Promise<StoryDTO[]> {
    try {
        const nonDraftStories = await getAllStories({ draft: false });
        return nonDraftStories;
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

export async function getAllPublicStoryPinsDTO(): Promise<StoryPinDTO[]> {
    try {
        const nonDraftStoryPins = await getAllStoryPins({ draft: false });
        return nonDraftStoryPins;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
}

export async function getAllStoriesDTO(): Promise<StoryDTO[]> {
    try {
        if (!(await isUserSuperAdmin())) {
            throw new Error("Unauthorized");
        }
        const allStories = await getAllStories();
        return allStories;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
}

export async function getLabPublicStoriesDTO(
    labSlug: string
): Promise<StoryDTO[]> {
    try {
        const nonDraftLabStories = await getAllStories({
            draft: false,
            lab: { slug: labSlug },
        });
        return nonDraftLabStories;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
}

export async function getLabPublicStoryPinsDTO(
    labSlug: string
): Promise<StoryPinDTO[]> {
    try {
        const nonDraftLabStories = await getAllStoryPins({
            draft: false,
            lab: { slug: labSlug },
        });
        return nonDraftLabStories;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
}

export async function getLabPrivateStoriesDTO(
    labSlug: string
): Promise<StoryDTO[]> {
    try {
        const user = await getCurrentUser();
        if (!user) {
            throw new Error("Unauthorized");
        }
        if (await isUserSuperAdmin()) {
            const stories = await getAllStories();
            return stories.filter(
                async (story) => await canUserViewStory(story)
            );
        } else if (await isUserMember(user, labSlug)) {
            const stories = await getAllStories();
            return stories.filter(
                async (story) => await canUserViewStory(story)
            );
        } else {
            throw new Error("Unauthorized");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
}

export async function getStoryDTO(id: string): Promise<StoryDTO> {
    try {
        const queryResult = await queryStory(id);

        if (!(await canUserViewStory(queryResult))) {
            throw new Error("You do not have permission to view this story.");
        }

        return queryResult;
    } catch (error) {
        console.error("Error getting story:", error);
        throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
}

export async function getStoriesByUserDTO(userId: string): Promise<StoryDTO[]> {
    try {
        const stories = await getStoriesByUser(userId);
        return stories;
    } catch (error) {
        console.error("Error getting stories by user:", error);
        throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
}
