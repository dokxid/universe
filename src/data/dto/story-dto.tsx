import "server-only";
import { getCurrentUser, isUserActive, isUserMember } from "../auth";
import { User } from "@workos-inc/node";
import { clientPromise } from "@/lib/mongodb/connections";
import { ExperienceData } from "@/types/api";
import { submitStoryFormSchema } from "@/data/formSchemas";
import { z } from "zod";
import { errorSanitizer } from "@/lib/utils/errorSanitizer";
import { nanoid } from "nanoid";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-provider-env";

const client = await clientPromise
    .then((client) => {
        return client;
    })
    .catch((err) => {
        throw new Error(err);
    });

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
        return await client
            .db("hl-universe")
            .collection<ExperienceData>("experiences")
            .find({})
            .toArray();
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

async function getExperience(experienceSlug: string): Promise<string> {
    const experience = await client
        .db("hl-universe")
        .collection<ExperienceData>("experiences")
        .findOne({ slug: experienceSlug });
    if (!experience) throw new Error("Experience not found");
    return JSON.stringify(experience);
}

async function getStories(
    viewer?: User,
    experienceSlug?: string
): Promise<string> {
    try {
        const experiences = await getExperiences();
        if (experienceSlug && viewer) {
            const filteredStories =
                experiences
                    .filter((experience) => experience.slug == experienceSlug)
                    .pop()?.stories ?? [];
            return JSON.stringify(
                (await canSeePrivateStory(viewer, experienceSlug))
                    ? filteredStories
                    : filteredStories.filter(
                          (story) => !story.draft && story.published
                      )
            );
        }
        return JSON.stringify(
            experiences
                .flatMap((experience) => experience.stories)
                .filter((story) => !story.draft && story.published)
        );
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

function canCreateStory(viewer: User, experienceSlug: string) {
    return canSeePrivateStory(viewer, experienceSlug);
}

function canSeePublicStory(viewer: User) {
    return true;
}

export async function canSeePrivateStory(viewer: User, experienceSlug: string) {
    const isActive = await isUserActive(viewer, experienceSlug);
    const isMember = await isUserMember(viewer, experienceSlug);
    return isActive && isMember;
}

export async function getPublicStoriesDTO() {
    return getStories();
}

export async function getLabStoriesDTO(experienceSlug: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Not authenticated");
    return getStories(currentUser, experienceSlug);
}

export async function getExperiencesDTO(): Promise<ExperienceData[]> {
    return getExperiences();
}

export async function getExperienceDTO(
    experienceSlug: string
): Promise<string> {
    return getExperience(experienceSlug);
}

export async function submitStoryDTO(formData: FormData, user: User) {
    const db = client.db("hl-universe");
    const storyCollection = db.collection("stories");

    // check if the user has permission to create a story for the given experience
    const experienceSlug = formData.get("experience") as string;
    if (!(await canCreateStory(user, experienceSlug))) {
        throw new Error(
            "You do not have permission to create a story for this experience."
        );
    }

    // validate the form data
    const validationResult = submitStoryFormSchema.safeParse(
        Object.fromEntries(formData)
    );
    if (!validationResult.success) {
        return { errors: z.treeifyError(validationResult.error) };
    }

    // prepare the data for insertion
    const data = validationResult.data;
    const uploadedFileName = `${data.experience}_${nanoid()}_${data.file.name}`;
    const storyToInsert = {
        author: data.author,
        content: data.content,
        title: data.title,
        latitude: data.latitude,
        longitude: data.longitude,
        tags: data.tags,
        year: data.year,
        featuredImage: uploadedFileName,
        draft: data.draft,

        // hardcoded stuff
        visible_universe: false,
    };
    const file = data.file as File;

    try {
        await uploadFile(file, uploadedFileName, data.experience);
        await storyCollection.insertOne(storyToInsert);
    } catch (e) {
        return errorSanitizer(e);
    }
}
