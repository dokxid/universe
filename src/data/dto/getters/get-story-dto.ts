import "server-only";

import { getCurrentUser, isUserMember, isUserSuperAdmin } from "@/data/auth";
import {
    canUserViewStory,
    isPublicStory,
} from "@/data/dto/auth/story-permissions";
import {
    getAllStories,
    getStoriesByUser,
    queryStory,
} from "@/data/fetcher/story-fetcher";
import { StoryDTO } from "@/types/dtos";
import mongoose from "mongoose";

export async function getAllPublicStoriesDTO(): Promise<StoryDTO[]> {
    try {
        const stories = await getAllStories();
        const filteredStories = stories.filter(isPublicStory);
        return filteredStories;
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
        const stories = await getAllStories();
        return stories;
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

export async function getLabPublicStoriesDTO(
    experienceSlug: string
): Promise<StoryDTO[]> {
    const stories = await getAllStories();
    const publicStories = stories.filter(isPublicStory);
    const filteredStories = publicStories.filter(
        (story) => story.experience === experienceSlug
    );
    return filteredStories;
}

export async function getLabPrivateStoriesDTO(
    experienceSlug: string
): Promise<StoryDTO[]> {
    try {
        const user = await getCurrentUser();
        if (await isUserSuperAdmin(user)) {
            const stories = await getAllStories();
            return stories.filter(
                async (story) => await canUserViewStory(story)
            );
        } else if (await isUserMember(user, experienceSlug)) {
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
        // validate id before creating ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid story id format.");
        }

        // parse serializable id to mongoose.Types.ObjectId
        const objectId = new mongoose.Types.ObjectId(id);
        const queryResult = await queryStory(objectId);

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
