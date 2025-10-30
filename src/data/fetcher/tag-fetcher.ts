import { prisma } from "@/lib/data/prisma/connections";
import { cache } from "react";
import "server-only";

export const getTags = cache(async () => {
    try {
        const result = await prisma.tag.findMany({
            include: {
                _count: {
                    select: { stories: true },
                },
            },
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
                    some: { story: { lab: { slug: slug } } },
                },
            },
            include: {
                _count: {
                    select: { stories: true },
                },
            },
        });
        return result;
    } catch (error) {
        console.error("Error fetching tags:", error);
        throw error;
    }
});
