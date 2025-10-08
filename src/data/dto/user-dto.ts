import "server-only";

import { getStoriesByUserDTO } from "@/data/dto/story-dto";
import { getUser, getUsersFromLab } from "@/data/fetcher/user-fetcher";
import { sanitizeUserDTO } from "@/data/transformers/user-transformer";
import { UserDTO } from "@/lib/data/mongodb/models/user-model";

export async function getUsersByLabDTO(labSlug: string): Promise<UserDTO[]> {
    try {
        const users = await getUsersFromLab(labSlug);
        if (!users) return [];
        const usersWithStory = await setStoriesForUsers(users);
        const sanitizedUsers = await Promise.all(
            usersWithStory.map(async (user) => {
                return await sanitizeUserDTO(user);
            })
        );
        return sanitizedUsers;
    } catch (error) {
        console.error("Error fetching users by lab:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}
export async function getUserDTO(userId: string): Promise<UserDTO | null> {
    try {
        const user = await getUser(userId);
        if (!user) return null;
        return await sanitizeUserDTO(user);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}

async function setStoriesForUsers(users: UserDTO[]) {
    try {
        if (!users) return [] as UserDTO[];
        return await Promise.all(
            users.map(async (user) => {
                const stories = await getStoriesByUserDTO(user._id);
                return {
                    ...user,
                    stories: stories || [],
                };
            })
        );
    } catch (error) {
        console.error("Error setting stories for users:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}
