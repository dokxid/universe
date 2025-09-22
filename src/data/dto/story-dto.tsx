import { workos } from "@/lib/auth";
import dbConnect from "@/lib/mongodb/connections";
import {
    ExperienceData,
    NewStoryData,
    StoryData,
    StoryDataDTO,
} from "@/types/api";
import { submitStoryFormSchema } from "@/types/form-schemas";
import Experience from "@/types/models/experiences";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-provider-env";
import { User } from "@workos-inc/node";
import { nanoid } from "nanoid";
import { cache } from "react";
import "server-only";
import { z } from "zod";
import { isUserActive, isUserMember } from "../auth";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: fromEnv(),
});

export async function uploadFile(
    file: File,
    key: string,
    slug: string
): Promise<void> {
    try {
        // Convert File to Buffer using the stream() method
        const bytes = await file.stream();
        const chunks = [];

        // Read all chunks from the stream
        const reader = bytes.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
        }

        // Combine all chunks into a single Buffer
        const buffer = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));

        // Upload the Buffer to S3
        await s3Client.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Body: buffer,
                Key: `${slug}/${key}`,
                ContentType: file.type,
                ContentLength: file.size,
            })
        );
    } catch (err) {
        console.error(`Failed to upload ${key}:`, err);
        throw err;
    }
}

async function getExperiences() {
    try {
        await dbConnect();
        const experiences = await Experience.find({}).exec();
        return experiences.map((exp) => exp.toJSON());
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

async function getExperience(experienceSlug: string): Promise<ExperienceData> {
    try {
        await dbConnect();
        const experience = await Experience.findOne({
            slug: experienceSlug,
        }).exec();
        if (!experience) throw new Error("experience not found");
        return experience.toJSON();
    } catch (err) {
        throw new Error(
            "couldn't fetch experience: " +
                (err instanceof Error ? err.message : "Unknown error")
        );
    }
}

async function getLabPrivateStories(viewer: User, experienceSlug: string) {
    if (!(await canSeePrivateStory(viewer, experienceSlug))) {
        throw new Error("You do not have permission to view these stories.");
    }
    try {
        const experiences = await getExperiences();
        const filteredStories =
            experiences
                .filter((experience) => experience.slug == experienceSlug)
                .pop()?.stories ?? [];
        return JSON.stringify(filteredStories);
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

async function getLabStories(experienceSlug: string): Promise<StoryData[]> {
    try {
        const experiences = await getExperiences();
        const filteredStories =
            experiences
                .filter((experience) => experience.slug == experienceSlug)
                .pop()?.stories ?? [];
        return filteredStories;
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

async function getPublicStories(): Promise<StoryData[]> {
    try {
        const experiences = await getExperiences();
        const flatStories = experiences.flatMap(
            (experience) => experience.stories
        );
        const filteredStories = flatStories.filter(
            (story: { draft: any; published: any }) =>
                !story.draft && story.published
        );
        return filteredStories;
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
        Experience.findOneAndUpdate(
            { slug: experienceSlug },
            { $push: { stories: storyToInsert } },
            { safe: true, upsert: false }
        ).exec();
    } catch (err) {
        console.error("Error inserting story:", err);
    }
}

function canCreateStory(viewer: User, experienceSlug: string) {
    return canSeePrivateStory(viewer, experienceSlug);
}

function canSeePublicStory(viewer: User) {
    return true;
}

async function canSeePrivateStory(viewer: User, experienceSlug: string) {
    const isActive = await isUserActive(viewer, experienceSlug);
    const isMember = await isUserMember(viewer, experienceSlug);
    return isActive && isMember;
}

export async function getPublicStoriesDTO() {
    try {
        const storiesToReturn = await getPublicStories();
        return JSON.stringify(storiesToReturn);
    } catch (err) {
        console.error("Error fetching public stories:", err);
        return "<error>";
    }
}

export async function getLabStoriesDTO(
    experienceSlug: string
): Promise<string> {
    try {
        const stories = (await getLabStories(experienceSlug)) as StoryDataDTO[];

        // get all authors and fetch their user data
        const authors = stories.map((story) => story.author);
        const uniqueAuthors = [...new Set(authors)];
        let users = [];
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

        return JSON.stringify(stories);
    } catch (err) {
        console.error("Error fetching lab stories:", err);
        return "<error>";
    }
}

export const getExperiencesDTO = cache(async (): Promise<string> => {
    try {
        return JSON.stringify(await getExperiences());
    } catch (err) {
        console.error("Error fetching experiences:", err);
        return "<error>";
    }
});

export async function getExperienceDTO(experienceSlug: string) {
    try {
        return JSON.stringify(await getExperience(experienceSlug));
    } catch (err) {
        console.error(`Error fetching experience ${experienceSlug}:`, err);
        return "<error>";
    }
}

export async function submitStoryDTO(formData: FormData, user: User) {
    // check if the user has permission to create a story for the given experience
    const experienceSlug = formData.get("experience") as string;
    if (!(await canCreateStory(user, experienceSlug))) {
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
        console.log(z.prettifyError(validationResult.error));
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
