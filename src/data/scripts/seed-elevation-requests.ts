"use server";

import { generateElevationRequests } from "@/data/scripts/seeds/elevation-requests-seeds";
import { ExperienceModel } from "@/lib/data/mongodb/models/experience-model";
export async function seedAllElevationRequests() {
    try {
        const experiences = await ExperienceModel.find({}).exec();
        for (const experience of experiences) {
            const stories = experience.stories || [];
            for (let i = 0; i < stories.length; i++) {
                await ExperienceModel.findOneAndUpdate(
                    { _id: experience._id, "stories._id": stories[i]._id },
                    {
                        $push: {
                            "stories.$.elevation_requests":
                                generateElevationRequests(),
                        },
                    },
                    { safe: true, upsert: false }
                ).exec();
                console.log(
                    `Seeding elevation requests for story ${i + 1}/${
                        stories.length
                    }`
                );
            }
            console.log(
                `Seeded elevation requests for experience: ${experience.slug}`
            );
        }
        console.log("Elevation requests seeding completed");
    } catch (err) {
        console.error("Error inserting story:", err);
    }
}

export async function seedElevationRequests(slug: string) {
    try {
        const experience = await ExperienceModel.findOne({ slug }).exec();
        const stories = experience.stories || [];
        for (let i = 0; i < stories.length; i++) {
            await ExperienceModel.findOneAndUpdate(
                { _id: experience._id, "stories._id": stories[i]._id },
                {
                    $push: {
                        "stories.$.elevation_requests":
                            generateElevationRequests(),
                    },
                },
                { safe: true, upsert: false }
            ).exec();
        }
        console.log("Elevation requests seeding completed");
    } catch (err) {
        console.error("Error inserting story:", err);
    }
}
