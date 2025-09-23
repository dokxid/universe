import "server-only";

import {
    getCurrentUser,
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

function isStoryOwner(viewer: User, story: StoryDTO) {
    return viewer.id === story.author;
}

async function canUserViewStory(user: User, story: StoryDTO) {
    if (isPublicStory(story)) {
        return true;
    }
    if (await canUserEditStory(user, story)) {
        return true;
    }
    return false;
}

function canUserCreateStory(user: User, experienceSlug: string) {
    return isUserPartOfOrganization(user, experienceSlug);
}

async function canUserEditStory(user: User, story: StoryDTO) {
    if (await isUserSuperAdmin(user, story.experience)) return true;
    if (isStoryOwner(user, story)) return true;
    return false;
}

async function fetchAndMapAuthorsForStoryDTO(
    stories: StoryDTO[]
): Promise<StoryDTO[]> {
    // get unique author ids
    const authors = stories.map((story) => story.author);
    const uniqueAuthors = [...new Set(authors)];
    const users = [];
    for (const author of uniqueAuthors) {
        try {
            const user = await workos.userManagement.getUser(author);
            users.push(user);
        } catch (err) {
            console.error(`Error fetching user ${author}:`, err);
        }
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

    return stories;
}

async function getLabPrivateStories(
    experienceSlug: string
): Promise<StoryDTO[]> {
    try {
        const experiences = await getExperiences();
        const experience = experiences.find(
            (experience) => experience.slug == experienceSlug
        );
        if (!experience) {
            throw new Error("Experience not found");
        }
        const stories = experience.stories.map((story) => ({
            ...story,
            experience: experienceSlug,
        })) as StoryDTO[];
        return stories;
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
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

export async function getPublicStoriesDTO() {
    const experiences = await getExperiences();
    const flatStories = experiences.flatMap((experience) => experience.stories);
    const filteredStories = flatStories.filter(
        (story: { draft: boolean; published: boolean }) =>
            !story.draft && story.published
    );
    return JSON.stringify(filteredStories);
}

export async function getLabPublicStoriesDTO(
    experienceSlug: string
): Promise<string> {
    const stories = await getLabPrivateStories(experienceSlug);
    const filteredStories = stories.filter(isPublicStory);
    const sanitizedStories = await fetchAndMapAuthorsForStoryDTO(
        filteredStories
    );
    return JSON.stringify(sanitizedStories);
}

export async function getLabPrivateStoriesDTO(
    experienceSlug: string
): Promise<string> {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login?returnTo=/" + experienceSlug + "/stories/dashboard");
    }
    const stories = await getLabPrivateStories(experienceSlug);
    const filteredStories = stories.filter((story) =>
        canUserViewStory(user, story)
    );

    // get all authors and fetch their user data
    const sanitizedStories = await fetchAndMapAuthorsForStoryDTO(
        filteredStories
    );

    return JSON.stringify(sanitizedStories);
}

export async function getStoryDTO(id: string): Promise<string> {
    const user = await getCurrentUser();

    // parse serializable id to mongoose.Types.ObjectId
    const objectId = new mongoose.Types.ObjectId(id);
    const queryResult = await queryStory(objectId);

    if (!canUserViewStory(user, queryResult)) {
        redirect("/login?returnTo=/stories/" + id);
    }

    return JSON.stringify(queryResult);
}

export async function submitStoryDTO(formData: FormData, user: User) {
    // check if the user has permission to create a story for the given experience
    const experienceSlug = formData.get("experience") as string;
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
        latitude: data.latitude,
        longitude: data.longitude,
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
