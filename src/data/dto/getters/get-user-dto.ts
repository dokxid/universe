import "server-only";

import { getUser, getUsers, UserFetched } from "@/data/fetcher/user-fetcher";
import { sanitizeToUserDTO } from "@/data/transformers/user-transformer";
import { UserDTO } from "@/types/dtos";

export async function getUsersByLabDTO(labSlug: string): Promise<UserDTO[]> {
    try {
        let users: UserFetched[] = [];
        if (labSlug === "universe") {
            users = await getUsers({ role: "admin" });
        } else {
            users = await getUsers({
                members: { some: { lab: { slug: labSlug } } },
            });
        }
        if (!users) return [];
        return users.map((user) => sanitizeToUserDTO(user));
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
        const user = await getUser({ id: userId });
        if (!user) throw new Error("User not found");
        const sanitizedUser = sanitizeToUserDTO(user);
        return sanitizedUser;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}
