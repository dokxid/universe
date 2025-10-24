import { Prisma, PrismaClient } from "@/generated/prisma/client";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

export async function getAStory() {
    try {
        const authorSelectFields: Prisma.UserSelect = {
            displayName: true,
            firstName: true,
            familyName: true,
            profilePictureUrl: true,
        };
        const allStories = await prisma.story.findFirst({
            include: {
                author: {
                    select: authorSelectFields,
                },
            },
        });
        return allStories;
    } catch (err) {
        console.error("Error getting all stories:", err);
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

(async () => {
    const result = await getAStory();
    console.log(result);
    process.exit(0);
})();
