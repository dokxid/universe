import { getCurrentUser } from "@/data/auth";
import {
    canUserCreateStory,
    canUserEditStoryId,
} from "@/data/dto/auth/story-permissions";
import { insertStory } from "@/data/fetcher/story-fetcher";
import { getUserByWorkOSId } from "@/data/fetcher/user-fetcher";
import dbConnect from "@/lib/data/mongodb/connections";
import { ExperienceModel } from "@/lib/data/mongodb/models/experience-model";
import { uploadFile } from "@/lib/data/uploader/s3";
import { uploadFileToPublicFolder } from "@/lib/data/uploader/server-store";
import { NewStoryData } from "@/types/dtos";
import {
    editContentFormSchema,
    editFeaturedPictureFormSchema,
    editStoryCoordinatesFormSchema,
    editStoryFormSchema,
    editVisibilityAndLicensingFormSchema,
    submitStoryFormSchema,
} from "@/types/form-schemas/story-form-schemas";
import { revalidateTag } from "next/cache";
import z from "zod";

export async function submitStoryDTO(formData: FormData) {
    try {
        // check if the user has permission to create a story for the given experience
        const user = await getCurrentUser();
        const userId = (await getUserByWorkOSId(user.id))?._id;
        if (!userId) {
            throw new Error("User must be logged in to create a story.");
        }
        if (!(await canUserCreateStory(formData.get("slug") as string))) {
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
            featuredImageUrl: path,
            draft: data.draft,
            visibleUniverse: data.universe,
            elevationRequests: [
                {
                    status: "created",
                    requestedAt: new Date(),
                    resolvedAt: new Date(),
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
