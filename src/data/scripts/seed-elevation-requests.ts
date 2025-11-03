"use server";

import { generateElevationRequests } from "@/data/scripts/seeds/elevation-requests-seeds";
import { StoryWhereInput } from "@/generated/prisma/models";
import { prisma } from "@/lib/data/prisma/connections";
import { faker } from "@faker-js/faker";

export async function seedElevationRequests(whereInput?: StoryWhereInput) {
    try {
        const stories = await prisma.story.findMany({
            where: whereInput,
        });
        if (stories.length === 0) {
            console.log(
                "No stories found. Skipping elevation requests seeding."
            );
            return;
        }
        for (let i = 0; i < stories.length; i++) {
            const elevationRequests = generateElevationRequests();
            const lastRequest = elevationRequests[elevationRequests.length - 1];
            const approved = lastRequest.status === "approved";
            await prisma.story.update({
                where: { id: stories[i].id },
                data: {
                    elevationRequests: {
                        create: elevationRequests,
                    },
                    visibleUniverse: approved ? faker.datatype.boolean(0.7) : false,
                },
            });
        }
    } catch (error) {
        console.error("Error inserting story:", error);
    }
}
