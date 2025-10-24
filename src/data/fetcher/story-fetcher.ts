import "server-only";

import { sanitizeToStoryDTO } from "@/data/transformers/story-transformer";
import { Prisma, PrismaClient } from "@/generated/prisma/client";
import { StoryModel } from "@/generated/prisma/models";
import { StoryDTO } from "@/types/dtos";

const prisma = new PrismaClient();

const authorSelectFields: { select: Prisma.UserSelect } = {
    select: {
        displayName: true,
        firstName: true,
        familyName: true,
        profilePictureUrl: true,
    },
};

const labSelectFields: { select: Prisma.LabSelect } = {
    select: {
        slug: true,
    },
};

export async function getAllStories(
    whereInput?: Prisma.StoryWhereInput
): Promise<StoryDTO[]> {
    try {
        const allStories = await prisma.story.findMany({
            where: whereInput,
            include: {
                author: authorSelectFields,
                lab: labSelectFields,
                tags: true,
                elevationRequests: true,
            },
        });
        const sanitizedStories = await Promise.all(
            allStories.map((story) => sanitizeToStoryDTO(story))
        );
        return sanitizedStories;
    } catch (err) {
        console.error("Error getting all stories:", err);
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

export async function queryStory(storyId: string): Promise<StoryDTO> {
    try {
        const story = await prisma.story.findUnique({
            where: {
                id: storyId,
            },
            include: {
                author: authorSelectFields,
                lab: labSelectFields,
                tags: true,
                elevationRequests: true,
            },
        });
        if (!story) {
            throw new Error("Story not found");
        }
        const sanitizedStory = await sanitizeToStoryDTO(story);
        return sanitizedStory;
    } catch (err) {
        console.error("Error querying story:", err);
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

export async function insertStory(
    storyToInsert: Prisma.StoryCreateInput
): Promise<StoryModel> {
    try {
        const result = await prisma.story.create({
            data: storyToInsert,
        });
        return result;
    } catch (err) {
        console.error("Error inserting story:", err);
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

export async function getStoriesByUser(userId: string): Promise<StoryDTO[]> {
    try {
        const result = await prisma.story.findMany({
            where: {
                author: {
                    id: userId,
                },
            },
            include: {
                author: authorSelectFields,
                lab: labSelectFields,
                tags: true,
                elevationRequests: true,
            },
        });
        const sanitizedStories = await Promise.all(
            result.map((story) => sanitizeToStoryDTO(story))
        );
        return sanitizedStories;
    } catch (err) {
        console.error("Error getting stories by user:", err);
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}
