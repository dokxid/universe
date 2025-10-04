import "server-only";

import { getExperiences } from "@/data/fetcher/experience-fetcher";
import { fetchAndMapAuthorsForStoryDTO } from "@/data/transformers/story-transformer";
import dbConnect from "@/lib/data/mongodb/connections";
import ExperienceModel from "@/lib/data/mongodb/models/experience-model";
import { Experience, NewStoryData, StoryDTO } from "@/types/dtos";
import mongoose from "mongoose";

export async function getAllStories(): Promise<StoryDTO[]> {
    try {
        const experiences = await getExperiences();
        const allSanitizedStories: StoryDTO[] = [];

        for (const experience of experiences) {
            if (!experience.stories || experience.stories.length === 0) {
                continue; // Skip to the next experience if no stories found
            }
            const stories = experience.stories.flatMap((story) => ({
                ...story,
                experience: experience.slug,
            })) as StoryDTO[];
            const sanitizedStories = await fetchAndMapAuthorsForStoryDTO(
                stories
            );
            allSanitizedStories.push(...sanitizedStories);
        }

        return allSanitizedStories;
    } catch (err) {
        console.error("Error getting all stories:", err);
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

export async function queryStory(
    storyId: mongoose.Types.ObjectId
): Promise<StoryDTO> {
    try {
        await dbConnect();

        const queryResult = (await ExperienceModel.aggregate([
            { $unwind: "$stories" },
            { $match: { "stories._id": storyId } },
        ]).exec()) as Experience[];

        // detect if no story was found
        if (!queryResult || queryResult.length === 0) {
            throw new Error("Story not found");
        }

        // add experience slug and author name to story dto
        const queriedStory: StoryDTO = queryResult[0]
            .stories as unknown as StoryDTO;
        queriedStory.experience = queryResult[0].slug;
        const storyWithAuthor = await fetchAndMapAuthorsForStoryDTO([
            queriedStory,
        ]);

        return storyWithAuthor[0];
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

export async function insertStory(
    storyToInsert: NewStoryData,
    experienceSlug: string
) {
    try {
        dbConnect();
        await ExperienceModel.findOneAndUpdate(
            { slug: experienceSlug },
            { $push: { stories: storyToInsert } },
            { safe: true, upsert: false }
        ).exec();
    } catch (err) {
        console.error("Error inserting story:", err);
    }
}
