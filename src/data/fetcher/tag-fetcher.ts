import { TagGetPayload } from "@/generated/prisma/models";
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
    }
}

export type TagWithCount = TagGetPayload<typeof includeOptions>;

export const getTags = cache(async (): Promise<TagWithCount[]> => {
    try {
        const result = await prisma.tag.findMany({
            where: { stories: { some: { story: { draft: false } } } },
            ...includeOptions
        });
        return result;
    } catch (error) {
        console.error("Error fetching tags:", error);
        throw error;
    }
});

export const getTagsForLab = cache(async (slug: string) => {
    try {
        const result = await prisma.tag.findMany({
            where: {
                stories: {
                    some: {
                        story: {
                            AND: {
                                lab: { slug: slug },
                                draft: false,
                            }
                        }
                    }
                },
            },
            ...includeOptions,
        });
        return result;
    } catch (error) {
        console.error("Error fetching tags:", error);
        throw error;
    }
});
