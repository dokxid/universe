import { StoryInclude, StoryWhereInput, TagGetPayload, TagInclude } from "@/generated/prisma/models";
import { prisma } from "@/lib/data/prisma/connections";
import { cache } from "react";
import "server-only";

const includeOptions = {
    include: {
        _count: {
            select: {
                stories: true,
            },
        },
    },
};

export type TagWithCount = TagGetPayload<typeof includeOptions>;

export const getTags = cache(async (): Promise<TagWithCount[]> => {
    try {
        const result = await prisma.tag.findMany({
            ...includeOptions,
        });
        return result;
    } catch (error) {
        console.error("Error fetching tags:", error);
        throw error;
    }
});

export const getTagsForLab = cache(async (slug: string) => {
    try {
        const storyWhereUniverse: StoryWhereInput = {
            draft: false,
            visibleUniverse: true,
        }
        const storyWhereLab: StoryWhereInput = {
            lab: { slug: slug },
            draft: false,
        }
        const whereCondition = slug === "universe" ? storyWhereUniverse : storyWhereLab;
        const includeOptions: TagInclude = {
            _count: {
                select: {
                    stories: { where: { story: whereCondition } }
                }
            },
        };
        const result = await prisma.tag.findMany({
            where: {
                stories: {
                    some: {
                        story: whereCondition
                    },
                },
            },
            include: includeOptions,
        });
        return result;
    } catch (error) {
        console.error("Error fetching tags:", error);
        throw error;
    }
});
