"use server";

import { test_story_doc } from "@/data/scripts/seeds/story-seeds";
import { prisma } from "@/lib/data/prisma/connections";
import { faker } from "@faker-js/faker";
import { UNESCO_TAGS_SEEDS } from "./seeds/unesco-tags-seeds";

export async function seedStories(
    labSlug: string,
    center: number[],
    numStories: number,
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
            `Found ${users.length} users for experience slug: ${labSlug}`,
        );
        for (let i = 0; i < numStories; i++) {
            const user = faker.helpers.arrayElement(users);
            const tags = faker.helpers.uniqueArray(
                UNESCO_TAGS_SEEDS.map((tag) => tag.name),
                faker.number.int({ min: 3, max: 8 }),
            );
            const tagIds = await prisma.tag.findMany({
                where: {
                    name: {
                        in: tags
                    }
                },
                select: { id: true },
            });

            const doc = await test_story_doc(center, labSlug, user?.id);
            const storyInsertResult = await prisma.story.create({
                data: {
                    ...doc,
                    lab: {
                        connect: { slug: labSlug },
                    },
                    elevationRequests: {
                        create: [
                            { status: "created", createdAt: faker.date.between({ from: new Date(2020, 0, 1), to: new Date(2021, 0, 1) }) },
                        ],
                    },
                },
            });

            await Promise.all(
                tagIds.map(async (tag) =>
                    prisma.tagsOnStories.create({
                        data: {
                            story: { connect: { id: storyInsertResult.id } },
                            tag: { connect: { id: tag.id } },
                        },
                    }),
                ),
            );


            console.log(
                `Inserted story ${storyInsertResult.id} for lab: ${labSlug}`,
            );
        }
        console.log(
            `Inserted ${numStories} stories for experience: ${labSlug}`,
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
                    [experience.lngCenter, experience.latCenter],
                    numStories,
                );
                console.log(
                    `Seeded ${numStories} stories for experience: ${experience.slug}`,
                );
            }),
        );
        console.log("Stories seeding completed");
    } catch (error) {
        console.error("Error seeding stories:", error);
    }
}
