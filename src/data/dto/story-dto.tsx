import dbConnect from "@/lib/mongodb/connections";
import { StoryData } from "@/types/api";
import { submitStoryFormSchema } from "@/types/formSchemas";
import Experience from "@/types/models/experiences";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-provider-env";
import { User } from "@workos-inc/node";
import { nanoid } from "nanoid";
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
        return JSON.stringify(experiences.map((exp) => exp.toJSON()));
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

async function getExperience(experienceSlug: string) {
    try {
        await dbConnect();
        const experience = await Experience.findOne({
            slug: experienceSlug,
        }).exec();
        if (!experience) throw new Error("experience not found");
        return JSON.stringify(experience.toJSON());
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
        return filteredStories.map((story) => story.toJSON());
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

async function getLabStories(experienceSlug: string) {
    try {
        const experiences = await getExperiences();
        const filteredStories = experiences
            .filter((experience) => experience.slug == experienceSlug)
            .pop()
            ?.stories.map((story) => story.toJSON());
        return JSON.stringify(filteredStories);
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

async function getPublicStories() {
    try {
        const experiences = JSON.parse(await getExperiences());
        const flatStories = experiences
            .flatMap((experience) => experience.stories)
        const filteredStories = flatStories
            .filter(
                (story: { draft: any; published: any }) =>
                    !story.draft && story.published
            );
        return JSON.stringify(filteredStories);
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

async function insertStory(storyToInsert: StoryData, experienceSlug: string) {
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
    return getPublicStories();
}

export async function getLabStoriesDTO(experienceSlug: string) {
    return getLabStories(experienceSlug);
}

export async function getExperiencesDTO(): Promise<string> {
    return getExperiences();
}

export async function getExperienceDTO(experienceSlug: string) {
    return getExperience(experienceSlug);
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
    const storyToInsert: StoryData = {
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
    console.log(JSON.stringify(storyToInsert));

    try {
        // Upload the file and insert the story
        await uploadFile(file, uploadedFileName, data.experience);
        await insertStory(storyToInsert, data.experience);
    } catch (e) {
        console.error("Error submitting story:", e);
    }
}
