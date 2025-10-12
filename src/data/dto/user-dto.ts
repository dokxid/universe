import "server-only";

import { getCurrentUser, isUserSuperAdmin } from "@/data/auth";
import { getStoriesByUserDTO } from "@/data/dto/story-dto";
import { getUser, getUsersFromLab } from "@/data/fetcher/user-fetcher";
import { sanitizeUserDTO } from "@/data/transformers/user-transformer";
import dbConnect from "@/lib/data/mongodb/connections";
import { UserDTO, UserModel } from "@/lib/data/mongodb/models/user-model";
import { uploadFile } from "@/lib/data/uploader/s3";
import { uploadFileToPublicFolder } from "@/lib/data/uploader/server-store";
import {
    editUserDetailsFormSchema,
    editUserDisplayNameFormSchema,
    editUserProfilePictureFormSchema,
} from "@/types/form-schemas";
import { revalidateTag } from "next/cache";
import z from "zod";

export async function canEditUser(userDTO: UserDTO): Promise<boolean> {
    const user = await getCurrentUser();
    if (await isUserSuperAdmin(user)) return true;
    return user.id === userDTO.externalId;
}

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

async function setStoryForUser(user: UserDTO) {
    try {
        if (!user) throw new Error("User not found");
        const stories = await getStoriesByUserDTO(user._id);
        return {
            ...user,
            stories: stories || [],
        };
    } catch (error) {
        console.error("Error setting story for user:", error);
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
                const userWithStories = await setStoryForUser(user);
                return userWithStories;
            })
        );
    } catch (error) {
        console.error("Error setting stories for users:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}

export async function editDisplayNameFormSchemaDTO(formData: FormData) {
    try {
        // check if the user is allowed to edit this user
        const userDTO = await getUserDTO(formData.get("userId") as string);
        if (!userDTO) throw new Error("User not found");
        const isAllowedToEdit = await canEditUser(userDTO);
        if (!isAllowedToEdit) {
            throw new Error(
                "User does not have permission to edit this story."
            );
        }

        // Preprocess the FormData into the correct types
        const rawData = Object.fromEntries(formData);
        const processedData = {
            ...rawData,
        };
        const result = editUserDisplayNameFormSchema.safeParse(processedData);
        if (!result.success) {
            throw new Error(JSON.stringify(z.flattenError(result.error)));
        }

        // update the user's display name in the database
        await dbConnect();
        await UserModel.updateOne(
            { _id: result.data.userId },
            {
                $set: {
                    displayName: result.data.displayName,
                    firstName: result.data.firstName,
                    lastName: result.data.lastName,
                    updatedAt: new Date(),
                },
            }
        );

        // revalidate caches
        revalidateTag(`users/${userDTO._id}`);
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}

export async function editUserDetailsFormSchemaDTO(formData: FormData) {
    try {
        // check if the user is allowed to edit this user
        const userDTO = await getUserDTO(formData.get("userId") as string);
        if (!userDTO) throw new Error("User not found");
        const isAllowedToEdit = await canEditUser(userDTO);
        if (!isAllowedToEdit) {
            throw new Error(
                "User does not have permission to edit this story."
            );
        }

        // Preprocess the FormData into the correct types
        const rawData = Object.fromEntries(formData);
        const processedData = {
            ...rawData,
        };
        const result = editUserDetailsFormSchema.safeParse(processedData);
        if (!result.success) {
            throw new Error(JSON.stringify(z.flattenError(result.error)));
        }

        // update the user's display name in the database
        await dbConnect();
        await UserModel.updateOne(
            { _id: result.data.userId },
            {
                $set: {
                    publicEmail: result.data.publicEmail,
                    position: result.data.position,
                    phoneNumber: result.data.phoneNumber,
                    website: result.data.website,
                    description: result.data.description,
                    updatedAt: new Date(),
                },
            }
        );

        // revalidate caches
        revalidateTag(`users/${userDTO._id}`);
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}

export async function editUserProfilePictureFormSchemaDTO(formData: FormData) {
    try {
        // check if the user is allowed to edit this user
        const userDTO = await getUserDTO(formData.get("userId") as string);
        if (!userDTO) throw new Error("User not found");
        const isAllowedToEdit = await canEditUser(userDTO);
        if (!isAllowedToEdit) {
            throw new Error(
                "User does not have permission to edit this story."
            );
        }

        // Preprocess the FormData into the correct types
        const rawData = Object.fromEntries(formData);
        const result = editUserProfilePictureFormSchema.safeParse(rawData);
        if (!result.success) {
            throw new Error(z.prettifyError(result.error));
        }
        const { profilePicture: file } = result.data;
        if (!file) {
            throw new Error("File is required and must be a valid file.");
        }

        // prepare the data for insertion
        const data = result.data;

        // upload the file and insert the story
        let path: string;
        if (process.env.LOCAL_UPLOADER === "true") {
            path = await uploadFileToPublicFolder(file, data.userId);
        } else {
            path = await uploadFile(file, data.userId);
        }

        // update the story's featured image URL in the database
        await dbConnect();
        await UserModel.updateOne(
            { _id: data.userId },
            {
                $set: {
                    profilePictureUrl: path,
                    updatedAt: new Date(),
                },
            }
        );

        // revalidate caches
        revalidateTag(`stories`);
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}
