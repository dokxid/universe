import {
    getCurrentUser,
    isUserPartOfOrganization,
    isUserSuperAdmin,
} from "@/data/auth";
import { getStoryDTO } from "@/data/dto/getters/get-story-dto";
import { StoryDTO } from "@/types/dtos";

export function isPublicStory(story: StoryDTO) {
    return !story.draft;
}
export async function isStoryOwner(story: StoryDTO) {
    try {
        const user = await getCurrentUser();
        if (!user) return false;
        return user.id === story.author.id;
    } catch (err) {
        console.error("Error checking story ownership:", err);
        return false;
    }
}
export async function canUserViewStory(story: StoryDTO) {
    const user = await getCurrentUser(false);
    if (isPublicStory(story)) {
        return true;
    }
    if (!user) {
        return false;
    }
    if (await isUserSuperAdmin()) {
        return true;
    }
    if (await isStoryOwner(story)) {
        return true;
    }
    return false;
}
export async function canUserCreateStory(labSlug: string) {
    const user = await getCurrentUser();
    if (!user) return false;
    if (labSlug === "universe") return false;
    if (await isUserSuperAdmin()) return true;
    return isUserPartOfOrganization(user, labSlug);
}
export async function canUserEditStory(story: StoryDTO) {
    if (await isUserSuperAdmin()) return true;
    if (await isStoryOwner(story)) return true;
    return false;
}
export async function canUserViewStoryId(storyId: string) {
    try {
        const story = await getStoryDTO(storyId);
        return canUserViewStory(story);
    } catch (err) {
        console.error("Error checking if user can view story:", err);
        return false;
    }
}
export async function canUserEditStoryId(storyId: string) {
    try {
        const story = await getStoryDTO(storyId);
        return canUserEditStory(story);
    } catch (err) {
        console.error("Error checking if user can edit story:", err);
        return false;
    }
}
