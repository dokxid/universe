import { PrismaClient } from "@/generated/prisma/client";
import { cache } from "react";
import "server-only";

const prisma = new PrismaClient();

export const getTags = cache(async () => {
    try {
        const result = await prisma.tag.findMany({
            include: {
                _count: {
                    select: { story: true },
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
                story: {
                    some: { lab: { slug: slug } },
                },
            },
            include: {
                _count: {
                    select: { story: true },
                },
            },
        });
        return result;
    } catch (error) {
        console.error("Error fetching tags:", error);
        throw error;
    }
});
