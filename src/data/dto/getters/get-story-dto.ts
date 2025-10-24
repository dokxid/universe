import "server-only";

import { getCurrentUser, isUserMember, isUserSuperAdmin } from "@/data/auth";
import { canUserViewStory } from "@/data/dto/auth/story-permissions";
import {
    getAllStories,
    getStoriesByUser,
    queryStory,
} from "@/data/fetcher/story-fetcher";
import { StoryDTO } from "@/types/dtos";

export async function getAllPublicStoriesDTO(): Promise<StoryDTO[]> {
    try {
        const nonDraftStories = await getAllStories({ draft: false });
        return nonDraftStories;
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

export async function getAllStoriesDTO(): Promise<StoryDTO[]> {
    try {
        const user = await getCurrentUser();
        if (!(await isUserSuperAdmin(user))) {
            throw new Error("Unauthorized");
        }
        const allStories = await getAllStories();
        return allStories;
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

export async function getLabPublicStoriesDTO(
    labSlug: string
): Promise<StoryDTO[]> {
    const nonDraftLabStories = await getAllStories({
        draft: false,
        lab: { slug: labSlug },
    });
    return nonDraftLabStories;
}

export async function getLabPrivateStoriesDTO(
    labSlug: string
): Promise<StoryDTO[]> {
    try {
        const user = await getCurrentUser();
        if (await isUserSuperAdmin(user)) {
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
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

export async function getStoryDTO(id: string): Promise<StoryDTO> {
    try {
        const queryResult = await queryStory(id);

        if (!(await canUserViewStory(queryResult))) {
            throw new Error("You do not have permission to view this story.");
        }

        return queryResult;
    } catch (err) {
        console.error("Error getting story:", err);
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

export async function getStoriesByUserDTO(userId: string): Promise<StoryDTO[]> {
    try {
        const stories = await getStoriesByUser(userId);
        return stories;
    } catch (err) {
        console.error("Error getting stories by user:", err);
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}
