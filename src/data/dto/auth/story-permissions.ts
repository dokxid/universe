import {
    getCurrentUser,
    getCurrentUserOptional,
    isUserPartOfOrganization,
    isUserSuperAdmin,
} from "@/data/auth";
import { getStoryDTO } from "@/data/dto/getters/get-story-dto";
import { StoryDTO } from "@/types/dtos";
import { User } from "@workos-inc/node";

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
    const user = await getCurrentUserOptional();
    if (isPublicStory(story)) {
        return true;
    }
    if (!user) {
        return false;
    }
    if (await isUserSuperAdmin(user)) {
        return true;
    }
    if (await isStoryOwner(story)) {
        return true;
    }
    return false;
}
export async function canUserCreateStory(experienceSlug: string) {
    const user = await getCurrentUser();
    if (!user) return false;
    if (experienceSlug === "universe") return false;
    if (await isUserSuperAdmin(user)) return true;
    return isUserPartOfOrganization(user, experienceSlug);
}
export async function canUserEditStory(user: User | null, story: StoryDTO) {
    if (await isUserSuperAdmin(user)) return true;
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
        const user = await getCurrentUser();
        const story = await getStoryDTO(storyId);
        return canUserEditStory(user, story);
    } catch (err) {
        console.error("Error checking if user can edit story:", err);
        return false;
    }
}
