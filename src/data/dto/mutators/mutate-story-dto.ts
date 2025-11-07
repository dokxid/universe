import { getCurrentUser } from "@/data/auth";
import {
    canUserCreateStory,
    canUserEditStoryId,
} from "@/data/dto/auth/story-permissions";
import { connectStoryTags, insertStory } from "@/data/fetcher/story-fetcher";
import { License } from "@/generated/prisma/client";
import { StoryCreateWithoutTagsInput } from "@/generated/prisma/models";
import { prisma } from "@/lib/data/prisma/connections";
import { uploadFile } from "@/lib/data/uploader/s3";
import { uploadFileToPublicFolder } from "@/lib/data/uploader/server-store";
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
        // check if the user is permitted to create a story
        const user = await getCurrentUser();
        if (!user) {
            throw new Error("User must be logged in to create a story.");
        }
        const userId = user.id;
        if (!(await canUserCreateStory(formData.get("slug") as string))) {
            throw new Error(
                "User does not have permission to create a story for this experience.",
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
        const tags = await prisma.tag.findMany({
            where: {
                name: { in: data.tags },
            },
            select: { id: true },
        });

        const storyToInsert = {
            author: { connect: { id: userId } },
            content: data.content,
            title: data.title,
            longitude: data.longitude,
            latitude: data.latitude,
            year: data.year,
            license: data.license as License,
            featuredImageUrl: path,
            draft: data.draft,
            visibleUniverse: data.universe,
            elevationRequests: {
                create: [{ status: "created" }],
            },
            lab: { connect: { slug: data.slug } },
        } satisfies StoryCreateWithoutTagsInput;

        const newStoryId = await insertStory(storyToInsert, tags);
        revalidateTag(`stories`);
        return newStoryId;
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error",
        );
    }
}

export async function editStoryPictureDTO(formData: FormData) {
    try {
        // check if the user is permitted to edit this story
        const user = await getCurrentUser();
        if (!user) {
            throw new Error("User must be logged in to edit a story.");
        }
        const isAllowedToEdit = await canUserEditStoryId(
            formData.get("storyId") as string,
        );
        if (!isAllowedToEdit) {
            throw new Error(
                "User does not have permission to edit this story.",
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

        const mutation = await prisma.story.update({
            where: { id: data.storyId },
            data: {
                featuredImageUrl: path,
                updatedAt: new Date(),
            },
        });

        // revalidate caches
        revalidateTag(`stories`);
        revalidateTag(`stories/${mutation.id}`);
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error",
        );
    }
}

export async function editContentFormSchemaDTO(formData: FormData) {
    try {
        // check if the user is permitted to edit this story
        const isAllowedToEdit = await canUserEditStoryId(
            formData.get("storyId") as string,
        );
        if (!isAllowedToEdit) {
            throw new Error(
                "User does not have permission to edit this story.",
            );
        }

        // Preprocess the FormData into the correct types
        const rawData = Object.fromEntries(formData);
        const result = editContentFormSchema.safeParse(rawData);
        if (!result.success) {
            throw new Error(z.prettifyError(result.error));
        }

        // update the story's featured image URL in the database
        const mutation = await prisma.story.update({
            where: { id: result.data.storyId },
            data: {
                content: result.data.content,
            },
        });

        // revalidate caches
        revalidateTag(`stories`);
        revalidateTag(`stories/${mutation.id}`);
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error",
        );
    }
}

export async function editStoryFormSchemaDTO(formData: FormData) {
    try {
        // check if the user is permitted to edit this story
        const isAllowedToEdit = await canUserEditStoryId(
            formData.get("storyId") as string,
        );
        if (!isAllowedToEdit) {
            throw new Error(
                "User does not have permission to edit this story.",
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
        const tags = await prisma.tag.findMany({
            where: {
                name: { in: result.data.tags },
            },
        });
        const mutation = await prisma.story.update({
            where: { id: result.data.storyId },
            data: {
                year: result.data.year,
                title: result.data.title,
            },
        });

        const storyTagResult = await connectStoryTags(mutation.id, tags);

        // revalidate caches
        revalidateTag(`stories`);
        revalidateTag(`stories/${mutation.id}`);
        return { mutation, storyTagResult };
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error",
        );
    }
}

export async function editVisibilityAndLicensingFormSchemaDTO(
    formData: FormData,
) {
    try {
        // check if the user is permitted to edit this story
        const isAllowedToEdit = await canUserEditStoryId(
            formData.get("storyId") as string,
        );
        if (!isAllowedToEdit) {
            throw new Error(
                "User does not have permission to edit this story.",
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
        const mutation = await prisma.story.update({
            where: { id: result.data.storyId },
            data: {
                license: result.data.license,
                draft: result.data.draft,
            },
        });

        // revalidate caches
        revalidateTag(`stories`);
        revalidateTag(`stories/${mutation.id}`);
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error",
        );
    }
}

export async function editStoryCoordinatesFormSchemaDTO(formData: FormData) {
    try {
        // check if the user is permitted to edit this story
        const isAllowedToEdit = await canUserEditStoryId(
            formData.get("storyId") as string,
        );
        if (!isAllowedToEdit) {
            throw new Error(
                "User does not have permission to edit this story.",
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
        const mutation = await prisma.story.update({
            where: { id: result.data.storyId },
            data: {
                ...result.data,
            },
        });

        // revalidate caches
        revalidateTag(`stories`);
        revalidateTag(`stories/${mutation.id}`);
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error",
        );
    }
}

export async function setDraftDTO(storyId: string, draft: boolean) {
    try {
        // check if the user is permitted to edit this story
        const isAllowedToEdit = await canUserEditStoryId(storyId);
        if (!isAllowedToEdit) {
            throw new Error(
                "User does not have permission to edit this story.",
            );
        }

        // update the story's draft status in the database
        const mutation = await prisma.story.update({
            where: { id: storyId },
            data: {
                draft,
            },
        });

        // revalidate caches
        revalidateTag(`stories`);
        revalidateTag(`stories/${mutation.id}`);
        return mutation;
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error",
        );
    }
}

export async function setVisibilityDTO(storyId: string, visibility: boolean) {
    try {
        // check if the user is permitted to edit this story
        const isAllowedToEdit = await canUserEditStoryId(storyId);
        if (!isAllowedToEdit) {
            throw new Error(
                "User does not have permission to edit this story.",
            );
        }
        const story = await prisma.story.findUnique({
            where: { id: storyId },
            select: {
                elevationRequests: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    select: { status: true },
                },
            },
        });

        // check elevation request status
        if (!story) throw new Error("Story not found.");
        const latestElevationRequest = story.elevationRequests[0];
        if (visibility && latestElevationRequest?.status !== "approved") {
            throw new Error(
                "Cannot make story visible while elevation request is not approved.",
            );
        }

        // update the story's draft status in the database
        const mutation = await prisma.story.update({
            where: { id: storyId },
            data: {
                visibleUniverse: visibility,
            },
        });

        // revalidate caches
        revalidateTag(`stories`);
        revalidateTag(`stories/${mutation.id}`);
        return mutation;
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error",
        );
    }
}
