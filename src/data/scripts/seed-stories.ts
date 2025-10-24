"use server";

import { test_story_doc } from "@/data/scripts/seeds/story-seeds";
import { PrismaClient } from "@/generated/prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

export async function seedStories(
    labSlug: string,
    center: number[],
    numStories: number
) {
    try {
        const users = await prisma.user.findMany({
            where: {
                members: {
                    some: {
                        lab: {
                            slug: labSlug,
                        },
                    },
                },
            },
        });
        console.log(
            `Found ${users.length} users for experience slug: ${labSlug}`
        );
        for (let i = 0; i < numStories; i++) {
            const user = faker.helpers.arrayElement(users);
            const doc = await test_story_doc(center, labSlug, user.id);
            const storyInsertResult = await prisma.lab.update({
                where: { slug: labSlug },
                data: {
                    stories: {
                        create: doc,
                    },
                },
            });
            console.log(
                `Inserted story ${storyInsertResult.id} for lab: ${labSlug}`
            );
        }
        console.log(
            `Inserted ${numStories} stories for experience: ${labSlug}`
        );
    } catch (err) {
        console.error("Error inserting story:", err);
    }
}

export async function seedAllStories(numStories: number = 40) {
    try {
        const allExperiences = await prisma.lab.findMany();
        await Promise.all(
            allExperiences.map(async (experience) => {
                await seedStories(
                    experience.slug,
                    experience.center.coordinates,
                    numStories
                );
                console.log(
                    `Seeded ${numStories} stories for experience: ${experience.slug}`
                );
            })
        );
        console.log("Stories seeding completed");
    } catch (error) {
        console.error("Error seeding stories:", error);
    }
}
