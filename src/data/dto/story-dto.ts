import "server-only";

import {
    getCurrentUser,
    isUserMember,
    isUserPartOfOrganization,
    isUserSuperAdmin,
} from "@/data/auth";
import {
    getAllStories,
    getStoriesByUser,
    insertStory,
    queryStory,
} from "@/data/fetcher/story-fetcher";
import { getUserByWorkOSId } from "@/data/fetcher/user-fetcher";
import dbConnect from "@/lib/data/mongodb/connections";
import { ExperienceModel } from "@/lib/data/mongodb/models/experience-model";
import { uploadFile } from "@/lib/data/uploader/s3";
import { uploadFileToPublicFolder } from "@/lib/data/uploader/server-store";
import { NewStoryData, StoryDTO } from "@/types/dtos";
import {
    editContentFormSchema,
    editFeaturedPictureFormSchema,
    editStoryCoordinatesFormSchema,
    editStoryFormSchema,
    editVisibilityAndLicensingFormSchema,
    submitStoryFormSchema,
} from "@/types/form-schemas/story-form-schemas";
import { User } from "@workos-inc/node";
import mongoose from "mongoose";
import { revalidateTag } from "next/cache";
import { z } from "zod";

function isPublicStory(story: StoryDTO) {
    return !story.draft;
}

async function isStoryOwner(viewer: User | null, story: StoryDTO) {
    try {
        if (!viewer) return false;
        const viewerId = (await getUserByWorkOSId(viewer.id))?._id;
        return viewerId === story.author;
    } catch (err) {
        console.error("Error checking story ownership:", err);
        return false;
    }
}

async function canUserViewStory(story: StoryDTO) {
    const user = await getCurrentUser();
    if (isPublicStory(story)) {
        return true;
    }
    if (!user) {
        return false;
    }
    if (await isUserSuperAdmin(user)) {
        return true;
    }
    if (await isStoryOwner(user, story)) {
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
    if (await isStoryOwner(user, story)) return true;
    return false;
}

export async function canUserViewStoryId(user: User | null, storyId: string) {
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

        if (!canUserViewStory(queryResult)) {
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

export async function submitStoryDTO(formData: FormData) {
    try {
        // check if the user has permission to create a story for the given experience
        const user = await getCurrentUser();
        const userId = (await getUserByWorkOSId(user.id))?._id;
        if (!userId) {
            throw new Error("User must be logged in to create a story.");
        }
        if (
            !(await canUserCreateStory(
                formData.get("experienceSlug") as string
            ))
        ) {
            throw new Error(
                "User does not have permission to create a story for this experience."
            );
        }

        // Validate the data
        const rawData = Object.fromEntries(formData);
        const processedData = {
            ...rawData,
            year: parseInt(rawData.year as string, 10),
            longitude: parseFloat(rawData.longitude as string),
            latitude: parseFloat(rawData.latitude as string),
            tags: JSON.parse(rawData.tags as string),
            universe: rawData.universe === "true",
            draft: rawData.draft === "true",
        };
        const validationResult = submitStoryFormSchema.safeParse(processedData);
        if (!validationResult.success) {
            throw new Error(z.prettifyError(validationResult.error));
        }
        const { featuredPicture: file } = validationResult.data;
        if (!file) {
            throw new Error("File is required and must be a valid file.");
        }

        // Upload the file and insert the story
        let path: string;
        if (process.env.LOCAL_UPLOADER === "true") {
            path = await uploadFileToPublicFolder(file);
        } else {
            path = await uploadFile(file);
        }

        // prepare the data for insertion
        const data = validationResult.data;
        const storyToInsert = {
            author: userId,
            content: data.content,
            title: data.title,
            location: {
                type: "Point",
                coordinates: [data.longitude, data.latitude],
            },
            tags: data.tags,
            year: data.year,
            license: data.license,
            featured_image_url: path,
            draft: data.draft,
            visible_universe: data.universe,
            elevation_requests: [
                {
                    status: "created",
                    requested_at: new Date(),
                    resolved_at: new Date(),
                },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        } as NewStoryData;

        const newStoryId = await insertStory(storyToInsert, data.slug);
        revalidateTag(`stories`);
        return newStoryId;
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}

export async function editStoryPictureDTO(formData: FormData) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            throw new Error("User must be logged in to edit a story.");
        }
        const isAllowedToEdit = await canUserEditStoryId(
            formData.get("storyId") as string
        );
        if (!isAllowedToEdit) {
            throw new Error(
                "User does not have permission to edit this story."
            );
        }

        // Preprocess the FormData into the correct types
        const rawData = Object.fromEntries(formData);
        const result = editFeaturedPictureFormSchema.safeParse(rawData);
        if (!result.success) {
            throw new Error(z.prettifyError(result.error));
        }
        const { featuredPicture: file } = result.data;
        if (!file) {
            throw new Error("File is required and must be a valid file.");
        }

        // prepare the data for insertion
        const data = result.data;

        // upload the file and insert the story
        let path: string;
        if (process.env.LOCAL_UPLOADER === "true") {
            path = await uploadFileToPublicFolder(file, data.lab);
        } else {
            path = await uploadFile(file, data.lab);
        }

        // update the story's featured image URL in the database
        await dbConnect();
        await ExperienceModel.updateOne(
            { "stories._id": data.storyId },
            {
                $set: {
                    "stories.$.featured_image_url": path,
                    "stories.$.updatedAt": new Date(),
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

export async function editContentFormSchemaDTO(formData: FormData) {
    try {
        const isAllowedToEdit = await canUserEditStoryId(
            formData.get("storyId") as string
        );
        if (!isAllowedToEdit) {
            throw new Error(
                "User does not have permission to edit this story."
            );
        }

        // Preprocess the FormData into the correct types
        const rawData = Object.fromEntries(formData);
        const result = editContentFormSchema.safeParse(rawData);
        if (!result.success) {
            throw new Error(z.prettifyError(result.error));
        }

        // update the story's featured image URL in the database
        await dbConnect();
        await ExperienceModel.updateOne(
            { "stories._id": result.data.storyId },
            {
                $set: {
                    "stories.$.content": result.data.content,
                    "stories.$.updatedAt": new Date(),
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

export async function editStoryFormSchemaDTO(formData: FormData) {
    try {
        const isAllowedToEdit = await canUserEditStoryId(
            formData.get("storyId") as string
        );
        if (!isAllowedToEdit) {
            throw new Error(
                "User does not have permission to edit this story."
            );
        }

        // Preprocess the FormData into the correct types
        const rawData = Object.fromEntries(formData);
        const processedData = {
            ...rawData,
            tags: JSON.parse(rawData.tags as string),
        };
        const result = editStoryFormSchema.safeParse(processedData);
        if (!result.success) {
            throw new Error(JSON.stringify(z.flattenError(result.error)));
        }

        // update the story's featured image URL in the database
        await dbConnect();
        await ExperienceModel.updateOne(
            { "stories._id": result.data.storyId },
            {
                $set: {
                    "stories.$.tags": result.data.tags,
                    "stories.$.year": result.data.year,
                    "stories.$.title": result.data.title,
                    "stories.$.updatedAt": new Date(),
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

export async function editVisibilityAndLicensingFormSchemaDTO(
    formData: FormData
) {
    try {
        const isAllowedToEdit = await canUserEditStoryId(
            formData.get("storyId") as string
        );
        if (!isAllowedToEdit) {
            throw new Error(
                "User does not have permission to edit this story."
            );
        }

        // Preprocess the FormData into the correct types
        const rawData = Object.fromEntries(formData);
        const processedData = {
            ...rawData,
            draft: Boolean(rawData.draft),
        };
        const result =
            editVisibilityAndLicensingFormSchema.safeParse(processedData);
        if (!result.success) {
            throw new Error(JSON.stringify(z.flattenError(result.error)));
        }

        // update the story's featured image URL in the database
        await dbConnect();
        await ExperienceModel.updateOne(
            { "stories._id": result.data.storyId },
            {
                $set: {
                    "stories.$.license": result.data.license,
                    "stories.$.draft": result.data.draft,
                    "stories.$.updatedAt": new Date(),
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

export async function editStoryCoordinatesFormSchemaDTO(formData: FormData) {
    try {
        const isAllowedToEdit = await canUserEditStoryId(
            formData.get("storyId") as string
        );
        if (!isAllowedToEdit) {
            throw new Error(
                "User does not have permission to edit this story."
            );
        }

        // Preprocess the FormData into the correct types
        const rawData = Object.fromEntries(formData);
        const processedData = {
            ...rawData,
            longitude: parseFloat(rawData.longitude as string),
            latitude: parseFloat(rawData.latitude as string),
        };
        const result = editStoryCoordinatesFormSchema.safeParse(processedData);
        if (!result.success) {
            throw new Error(JSON.stringify(z.flattenError(result.error)));
        }

        // update the story's featured image URL in the database
        await dbConnect();
        await ExperienceModel.updateOne(
            { "stories._id": result.data.storyId },
            {
                $set: {
                    "stories.$.location": {
                        type: "Point",
                        coordinates: [
                            result.data.longitude,
                            result.data.latitude,
                        ],
                    },
                    "stories.$.updatedAt": new Date(),
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
