import "server-only";

import {
    getCurrentUser,
    getCurrentUserOptional,
    isUserMember,
    isUserPartOfOrganization,
    isUserSuperAdmin,
} from "@/data/auth";
import { getExperiences } from "@/data/dto/experience-dto";
import { workos } from "@/lib/auth";
import { uploadFile } from "@/lib/aws/s3";
import dbConnect from "@/lib/mongodb/connections";
import { Experience, NewStoryData, Story, StoryDTO } from "@/types/api";
import { submitStoryFormSchema } from "@/types/form-schemas";
import ExperienceModel from "@/types/models/experiences";
import { User } from "@workos-inc/node";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import { z } from "zod";

function isPublicStory(story: Story) {
    return !story.draft && story.published;
}

function isStoryOwner(viewer: User | null, story: StoryDTO) {
    if (!viewer) return false;
    return viewer.id === story.author;
}

async function canUserViewStory(user: User | null, story: StoryDTO) {
    if (isPublicStory(story)) {
        return true;
    }
    if (!user) {
        return false;
    }
    if (await canUserEditStory(user, story)) {
        return true;
    }
    return false;
}

function canUserCreateStory(user: User | null, experienceSlug: string) {
    return isUserPartOfOrganization(user, experienceSlug);
}

async function canUserEditStory(user: User | null, story: StoryDTO) {
    if (await isUserSuperAdmin(user, story.experience)) return true;
    if (isStoryOwner(user, story)) return true;
    return false;
}

async function fetchAndMapAuthorsForStoryDTO(
    stories: StoryDTO[]
): Promise<StoryDTO[]> {
    if (stories.length === 0) {
        throw new Error("No stories provided");
    }
    try {
        const users = [];
        const authors = stories.map((story) => story.author);
        const uniqueAuthors = [...new Set(authors)];
        if (uniqueAuthors.length === 0) {
            throw new Error("No authors found in the provided stories");
        }
        for (const author of uniqueAuthors) {
            const user = await workos.userManagement.getUser(author);
            if (!user) {
                continue;
            }
            users.push(user);
        }

        if (users.length === 0) {
            throw new Error("No authors found for the provided stories");
        }
        // map author ids to user data
        const authorMap: { [key: string]: string } = {};
        users.forEach((user) => {
            authorMap[user.id] = user.firstName + " " + user.lastName;
        });

        // replace author ids with user data in stories
        stories.forEach((story) => {
            if (authorMap[story.author]) {
                story.author_name = authorMap[story.author];
            } else {
                story.author_name = "Unknown Author";
            }
        });
    } catch (err) {
        console.error("Error fetching authors:", err);
    }

    return stories;
}

async function queryStory(storyId: mongoose.Types.ObjectId): Promise<StoryDTO> {
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

async function insertStory(
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

export async function getAllPublicStoriesDTO(): Promise<StoryDTO[]> {
    try {
        const stories = await getAllStories();
        const filteredStories = stories.filter(isPublicStory);
        return filteredStories;
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

async function getAllStories(): Promise<StoryDTO[]> {
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
        console.log("Error getting all stories:", err);
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

export async function getLabPublicStoriesDTO(
    experienceSlug: string
): Promise<StoryDTO[]> {
    const stories = await getAllStories();
    const publicStories = stories.filter(isPublicStory);
    const filteredStories = publicStories.filter(
        (story) => story.experience === experienceSlug
    );
    return filteredStories;
}

export async function getLabPrivateStoriesDTO(
    experienceSlug: string
): Promise<StoryDTO[]> {
    const user = await getCurrentUser();
    if (!(await isUserMember(user, experienceSlug))) {
        redirect("/login?returnTo=/" + experienceSlug + "/stories/dashboard");
    }
    const stories = await getAllStories();
    const filteredStories = stories.filter(
        async (story) => await canUserViewStory(user, story)
    );
    return filteredStories;
}

export async function getStoryDTO(id: string): Promise<StoryDTO> {
    const user = await getCurrentUserOptional();

    console.log("Fetching story with id:", id);
    // validate id before creating ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid story id format.");
    }

    // parse serializable id to mongoose.Types.ObjectId
    const objectId = new mongoose.Types.ObjectId(id);
    const queryResult = await queryStory(objectId);

    if (!canUserViewStory(user, queryResult)) {
        redirect("/login?returnTo=/stories/" + id);
    }

    return queryResult;
}

export async function submitStoryDTO(formData: FormData, user: User | null) {
    // check if the user has permission to create a story for the given experience
    const experienceSlug = formData.get("experience") as string;
    if (!user) {
        throw new Error("User must be logged in to submit a story.");
    }
    if (!(await canUserCreateStory(user, experienceSlug))) {
        throw new Error(
            "You do not have permission to create a story for this experience."
        );
    }

    // Preprocess the FormData into the correct types
    const rawData = Object.fromEntries(formData);
    const processedData = {
        title: rawData.title as string,
        content: rawData.content as string,
        year: parseInt(rawData.year as string, 10),
        longitude: parseFloat(rawData.longitude as string),
        latitude: parseFloat(rawData.latitude as string),
        tags: JSON.parse(rawData.tags as string),
        author: rawData.author as string,
        experience: rawData.experience as string,
        draft: rawData.draft === "true",
    };
    const file = formData.get("file") as File;
    if (!file) {
        throw new Error("File is required and must be a valid file.");
    }

    // Validate the processed data
    const validationResult = submitStoryFormSchema.safeParse(processedData);
    if (!validationResult.success) {
        throw new Error(z.prettifyError(validationResult.error));
    }

    // prepare the data for insertion
    const data = validationResult.data;
    const uploadedFileName = `${data.experience}_${nanoid()}_${file.name}`;
    const storyToInsert: NewStoryData = {
        author: user.id,
        content: data.content,
        title: data.title,
        location: {
            type: "Point",
            coordinates: [data.longitude, data.latitude],
        },
        tags: data.tags,
        year: data.year,
        featured_image_url: uploadedFileName,
        draft: data.draft,

        // hardcoded stuff
        visible_universe: true,
        published: true,
    };

    try {
        // Upload the file and insert the story
        await uploadFile(file, uploadedFileName, data.experience);
        await insertStory(storyToInsert, data.experience);
    } catch (e) {
        console.error("Error submitting story:", e);
    }
}
