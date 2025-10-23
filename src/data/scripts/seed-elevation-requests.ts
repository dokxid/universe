"use server";

import { generateElevationRequests } from "@/data/scripts/seeds/elevation-requests-seeds";
import { PrismaClient } from "@/generated/prisma/client";
import { ExperienceModel } from "@/lib/data/mongodb/models/experience-model";

const prisma = new PrismaClient();

export async function seedAllElevationRequests() {
    try {
        const stories = await prisma.story.findMany();
        if (stories.length === 0) {
            console.log(
                "No stories found. Skipping elevation requests seeding."
            );
            return;
        }
        for (let i = 0; i < stories.length; i++) {
            await prisma.story.update({
                where: { id: stories[i].id },
                data: {
                    elevationRequests: {
                        create: generateElevationRequests(),
                    },
                },
            });
        }
    } catch (error) {
        console.error("Error inserting story:", error);
    }
}

export async function seedElevationRequests(slug: string) {
    try {
        const experience = await ExperienceModel.findOne({ slug }).exec();
        const stories = experience.stories || [];
        for (let i = 0; i < stories.length; i++) {
            await prisma.lab.update({
                where: { slug: experience.slug },
                data: {
                    stories: {
                        update: {
                            where: { id: stories[i]._id.toString() },
                            data: {
                                elevationRequests: {
                                    create: generateElevationRequests(),
                                },
                            },
                        },
                    },
                },
            });
        }
        console.log("Elevation requests seeding completed");
    } catch (err) {
        console.error("Error inserting story:", err);
    }
}
