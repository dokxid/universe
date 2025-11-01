import "server-only";

import { sanitizeToStoryDTO, sanitizeToStoryPinDTO } from "@/data/transformers/story-transformer";
import { Prisma, TagsOnStories } from "@/generated/prisma/client";
import { StoryInclude, StoryModel, StorySelect } from "@/generated/prisma/models";
import { StoryDTO, StoryPinDTO } from "@/types/dtos";
import { prisma } from "@/lib/data/prisma/connections";

const authorSelectFields: { select: Prisma.UserSelect } = {
    select: {
        id: true,
        displayName: true,
        firstName: true,
        familyName: true,
        profilePictureUrl: true,
    },
};

const labSelectFields: { select: Prisma.LabSelect } = {
    select: {
        id: true,
        slug: true,
    },
};

export async function getAllStoryPins(
    whereInput?: Prisma.StoryWhereInput,
): Promise<StoryPinDTO[]> {
    try {
        const pinSelectFields = {
            id: true,
            longitude: true,
            latitude: true,
            year: true,
            lab: { select: { slug: true } },
            tags: { select: { tag: true } },
        } satisfies StorySelect;
        const allStories = await prisma.story.findMany({
            where: whereInput,
            select: pinSelectFields
        })
        const sanitizedStories = await Promise.all(
            allStories.map((story) => sanitizeToStoryPinDTO(story))
        )
        return sanitizedStories;
    } catch (err) {
        console.error("Error getting all stories:", err);
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

export async function getAllStories(
    whereInput?: Prisma.StoryWhereInput,
): Promise<StoryDTO[]> {
    try {
        const storyIncludeFields = {
            author: { select: authorSelectFields.select },
            lab: { select: labSelectFields.select },
            elevationRequests: true,
            tags: { select: { tag: true } },
        } satisfies StoryInclude;
        const allStories = await prisma.story.findMany({
            where: whereInput,
            include: storyIncludeFields
        })
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
                tags: {
                    select: { tag: true }
                },
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
    storyToInsert: Prisma.StoryCreateInput,
    tags: { id: string }[],
): Promise<{ result: StoryModel; tagStoryResult: TagsOnStories[] }> {
    try {
        const result = await prisma.story.create({
            data: storyToInsert,
        });
        const tagStoryResult = await Promise.all(
            tags.map(async (tag) =>
                prisma.tagsOnStories.create({
                    data: {
                        storyId: result.id,
                        tagId: tag.id,
                    },
                }),
            ),
        );
        return { result, tagStoryResult };
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
                tags: { select: { tag: true } },
                elevationRequests: true,
            },
        });
        const sanitizedStories = await Promise.all(
            result.map((story) => sanitizeToStoryDTO(story)),
        );
        return sanitizedStories;
    } catch (err) {
        console.error("Error getting stories by user:", err);
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

export async function connectStoryTags(
    storyId: string,
    tags: { id: string }[],
): Promise<TagsOnStories[]> {
    const storyTagResult = await Promise.all(
        tags.map(async (tag) =>
            prisma.tagsOnStories.upsert({
                where: {
                    storyId_tagId: {
                        storyId: storyId,
                        tagId: tag.id,
                    },
                },
                create: {
                    storyId: storyId,
                    tagId: tag.id,
                },
                update: {},
            }),
        ),
    );
    return storyTagResult;
}
