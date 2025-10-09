import "server-only";

import { getExperiences } from "@/data/fetcher/experience-fetcher";
import { sanitizeExperience } from "@/data/transformers/experience-transformer";
import { fetchAndMapAuthorsForStoryDTO } from "@/data/transformers/story-transformer";
import dbConnect from "@/lib/data/mongodb/connections";
import ExperienceModel from "@/lib/data/mongodb/models/experience-model";
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
        const labs = await getExperiences();
        const allSanitizedStories: StoryDTO[] = [];

        for (const lab of labs) {
            const sanitizedStories = await sanitizeLabStories(lab);
            allSanitizedStories.push(...sanitizedStories);
        }
        console.log(
            "All story authorIds:",
            allSanitizedStories.map((s) => s.author)
        );
        console.log("Looking for userId:", userId);

        const storiesByUser = allSanitizedStories.filter(
            (story) => story.author === String(userId)
        );

        console.log(`Found ${storiesByUser.length} stories for user ${userId}`);
        return storiesByUser;
    } catch (err) {
        console.error("Error getting stories by user:", err);
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}
