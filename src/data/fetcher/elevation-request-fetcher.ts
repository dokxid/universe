import "server-only";

import dbConnect from "@/lib/data/mongodb/connections";
import { ExperienceModel } from "@/lib/data/mongodb/models/experience-model";
import { NewElevationRequestData } from "@/types/dtos";
import mongoose from "mongoose";

export async function insertElevationRequest(
    slug: string,
    requestToInsert: NewElevationRequestData,
    storyId: mongoose.Types.ObjectId
) {
    try {
        dbConnect();
        await ExperienceModel.findOneAndUpdate(
            { slug: slug, "stories._id": storyId },
            {
                $push: {
                    "stories.$.elevation_requests": requestToInsert,
                },
            },
            { safe: true, upsert: false }
        ).exec();
    } catch (err) {
        console.error("Error inserting elevation request:", err);
        throw err; // Re-throw to propagate the error
    }
}
