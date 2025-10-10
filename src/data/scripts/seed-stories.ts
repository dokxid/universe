"use server";

import { test_story_doc } from "@/data/scripts/seeds/story-seeds";
import dbConnect from "@/lib/data/mongodb/connections";
import ExperienceModel from "@/lib/data/mongodb/models/experience-model";
import { UserModel } from "@/lib/data/mongodb/models/user-model";
import { faker } from "@faker-js/faker";
export async function seedStories(
    experienceSlug: string,
    center: number[],
    numStories: number
) {
    try {
        await dbConnect();
        const users = await UserModel.find({
            "labs.slug": experienceSlug,
        });
        console.log(
            `Found ${users.length} users for experience slug: ${experienceSlug}`
        );
        for (let i = 0; i < numStories; i++) {
            const user = faker.helpers.arrayElement(users);

            const doc = await test_story_doc(center, experienceSlug, user._id);
            await ExperienceModel.findOneAndUpdate(
                { slug: experienceSlug },
                { $push: { stories: doc } },
                { safe: true, upsert: false }
            );
        }
    } catch (err) {
        console.error("Error inserting story:", err);
    }
}

export async function seedAllStories(numStories: number = 40) {
    try {
        await dbConnect();
        const allExperiences = await ExperienceModel.find({});
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
