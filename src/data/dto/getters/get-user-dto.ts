import "server-only";

import { getUser, getUsersFromLab } from "@/data/fetcher/user-fetcher";
import {
    sanitizeUserDTO,
    setStoriesForUsers,
    setStoryForUser,
} from "@/data/transformers/user-transformer";
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

/**
 * Retrieves a user by their ObjectId and returns a sanitized UserDTO with associated stories.
 *
 * @param userId - The database ObjectId of the user to retrieve
 * @returns UserDTO object with stories, or null if user not found
 * @throws {Error} When user is not found or when there's an error during fetching/processing
 *
 * @example
 * ```typescript
 * const user = await getUserDTO("faker.database.mongodbObjectId()");
 * if (user) {
 *   console.log(user.stories); // Array of user's stories
 * }
 * ```
 */
export async function getUserDTO(userId: string): Promise<UserDTO | null> {
    try {
        const user = await getUser(userId);
        if (!user) throw new Error("User not found");
        const userWithStories = await setStoryForUser(user);
        if (!userWithStories) throw new Error("User not found");
        return await sanitizeUserDTO(userWithStories);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}

/**
 * Retrieves a user by their external ID (from the authentication provider) and returns a sanitized UserDTO with associated stories.
 *
 * @param userId - The external ID of the user to retrieve
 * @returns UserDTO object with stories, or null if user not found
 * @throws {Error} When user is not found or when there's an error during fetching/processing
 *
 * @example
 * ```typescript
 * const user = await getUserDTO("user_");
 * if (user) {
 *   console.log(user.stories); // Array of user's stories
 * }
 * ```
 */
export async function getUserFromWorkOSIdDTO(
    workOSId: string
): Promise<UserDTO | null> {
    try {
        const user = await getUser(workOSId, true);
        if (!user) return null;
        return await sanitizeUserDTO(user);
    } catch (error) {
        console.error("Error fetching user by WorkOS ID:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}
