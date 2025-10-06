"use server";

import { test_story_doc } from "@/data/scripts/seeds/story-seeds";
import dbConnect from "@/lib/data/mongodb/connections";
import ExperienceModel from "@/lib/data/mongodb/models/experience-model";
export async function seedStories(
    experienceSlug: string,
    center: number[],
    numStories: number
) {
    try {
        for (let i = 0; i < numStories; i++) {
            const doc = await test_story_doc(center);
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
            })
        );
        console.log("Stories seeding completed");
    } catch (error) {
        console.error("Error seeding stories:", error);
    }
}
