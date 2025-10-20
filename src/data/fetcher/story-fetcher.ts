import "server-only";

import { getExperiences } from "@/data/fetcher/experience-fetcher";
import { sanitizeExperience } from "@/data/transformers/experience-transformer";
import { fetchAndMapAuthorsForStoryDTO } from "@/data/transformers/story-transformer";
import dbConnect from "@/lib/data/mongodb/connections";
import { ExperienceModel } from "@/lib/data/mongodb/models/experience-model";
import { Experience, NewStoryData, StoryDTO } from "@/types/dtos";
import mongoose from "mongoose";

export async function sanitizeLabStories(lab: Experience): Promise<StoryDTO[]> {
    try {
        if (!lab.stories || lab.stories.length === 0) {
            return [];
        }
        const stories = lab.stories.flatMap((story) => ({
            ...story,
            experience: lab.slug,
        })) as StoryDTO[];
        const sanitizedStories = await fetchAndMapAuthorsForStoryDTO(stories);
        return sanitizedStories;
    } catch (error) {
        console.error("Error sanitizing lab stories:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}

export async function getAllStories(): Promise<StoryDTO[]> {
    try {
        const experiences = await getExperiences();
        const allSanitizedStories: StoryDTO[] = [];

        for (const experience of experiences) {
            const sanitizedStories = await sanitizeLabStories(experience);
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

        // Find the specific story by ID instead of taking the first one
        const queriedStory = sanitizedLabWithFoundStories.stories.find(
            (story) => story._id === storyId.toString()
        ) as Omit<StoryDTO, "experience" | "authorName">;

        if (!queriedStory) {
            throw new Error("Story not found in sanitized stories");
        }

        // add experience slug and author name to story dto
        const storyDTO = {
            ...queriedStory,
            experience: sanitizedLabWithFoundStories.slug,
            authorName: "", // will be populated in fetchAndMapAuthorsForStoryDTO
        };

        const storyWithAuthor = await fetchAndMapAuthorsForStoryDTO([storyDTO]);

        return storyWithAuthor[0];
    } catch (err) {
        console.error("Error querying story:", err);
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

export async function insertStory(
    storyToInsert: NewStoryData,
    slug: string
): Promise<string> {
    try {
        await dbConnect();
        const result = await ExperienceModel.findOneAndUpdate(
            { slug: slug },
            { $push: { stories: storyToInsert } },
            { new: true, upsert: false } // Return the updated document
        ).exec();

        if (!result) {
            throw new Error("Inserted lab not found");
        }

        // Get the last story (the one we just pushed)
        const insertedStory = result.stories[result.stories.length - 1];

        if (!insertedStory || !insertedStory._id) {
            throw new Error("Failed to insert story");
        }

        const storyId = insertedStory._id.toString();
        console.log("Inserted story ID:", storyId);

        return storyId;
    } catch (err) {
        console.error("Error inserting story:", err);
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

export async function getStoriesByUser(userId: string): Promise<StoryDTO[]> {
    try {
        await dbConnect();
        const labs = await getExperiences();
        const allSanitizedStories: StoryDTO[] = [];

        for (const lab of labs) {
            const sanitizedStories = await sanitizeLabStories(lab);
            allSanitizedStories.push(...sanitizedStories);
        }

        const storiesByUser = allSanitizedStories.filter(
            (story) => story.author === String(userId)
        );

        return storiesByUser;
    } catch (err) {
        console.error("Error getting stories by user:", err);
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}
