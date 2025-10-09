import "server-only";

import { getExperiences } from "@/data/fetcher/experience-fetcher";
import { sanitizeExperience } from "@/data/transformers/experience-transformer";
import { fetchAndMapAuthorsForStoryDTO } from "@/data/transformers/story-transformer";
import dbConnect from "@/lib/data/mongodb/connections";
import ExperienceModel from "@/lib/data/mongodb/models/experience-model";
import { NewStoryData, StoryDTO } from "@/types/dtos";
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
        // get lab with found stories, and detect if no story was found
        await dbConnect();
        const labWithFoundStories = await ExperienceModel.findOne({
            "stories._id": storyId,
        }).exec();
        if (!labWithFoundStories) {
            throw new Error("Story not found");
        }
        const sanitizedLabWithFoundStories =
            sanitizeExperience(labWithFoundStories);
        if (!sanitizedLabWithFoundStories) {
            throw new Error("Story not found");
        }

        // add experience slug and author name to story dto
        const queriedStory: StoryDTO = sanitizedLabWithFoundStories
            .stories[0] as unknown as StoryDTO;
        queriedStory.experience = sanitizedLabWithFoundStories.slug;
        const storyWithAuthor = await fetchAndMapAuthorsForStoryDTO([
            queriedStory,
        ]);

        return storyWithAuthor[0];
    } catch (err) {
        console.error("Error querying story:", err);
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
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

export async function getStoriesByUser(userId: string): Promise<StoryDTO[]> {
    try {
        await dbConnect();
        const userStories: StoryDTO[] = await ExperienceModel.find({
            "stories.author": userId,
        }).exec();
        return userStories;
    } catch (err) {
        console.error("Error getting stories by user:", err);
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}
