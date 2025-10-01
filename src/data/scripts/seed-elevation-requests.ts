import { generateElevationRequests } from "@/data/scripts/seeds/elevation-requests-seeds";
import ExperienceModel from "@/types/models/experiences";
export async function seedElevationRequests() {
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
            }
        }
        console.log("Elevation requests seeding completed");
    } catch (err) {
        console.error("Error inserting story:", err);
    }
}
