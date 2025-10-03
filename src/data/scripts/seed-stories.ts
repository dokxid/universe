"use server";

import { test_story_doc } from "@/data/scripts/seeds/story-seeds";
import ExperienceModel from "@/lib/data/mongodb/models/experience-model";
export async function seedStories(
    experienceSlug: string,
    center: number[],
    amount: number
) {
    try {
        for (let i = 0; i < amount; i++) {
            const doc = await test_story_doc(center);
            await ExperienceModel.findOneAndUpdate(
                { slug: experienceSlug },
                { $push: { stories: doc } },
                { safe: true, upsert: false }
            ).exec();
        }
    } catch (err) {
        console.error("Error inserting story:", err);
    }
}
