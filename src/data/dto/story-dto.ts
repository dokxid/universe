import "server-only";

import {
    getCurrentUser,
    getCurrentUserOptional,
    isUserAdmin,
    isUserMember,
    isUserPartOfOrganization,
    isUserSuperAdmin,
} from "@/data/auth";
import { getExperiences } from "@/data/fetcher/experience-fetcher";
import { fetchAndMapAuthorsForStoryDTO } from "@/data/transformers/story-transformer";
import dbConnect from "@/lib/data/mongodb/connections";
import ExperienceModel from "@/lib/data/mongodb/models/experiences";
import { uploadFile } from "@/lib/data/uploader/s3";
import { uploadFileToLabFolder } from "@/lib/data/uploader/server-store";
import {
    Experience,
    NewElevationRequestData,
    NewStoryData,
    Story,
    StoryDTO,
} from "@/types/dtos";
import { submitStoryFormSchema } from "@/types/form-schemas";
import { User } from "@workos-inc/node";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

function isPublicStory(story: Story) {
    return !story.draft;
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
    if (isStoryOwner(user, story)) {
        return true;
    }
    if (!story.draft && (await isUserMember(user, story.experience))) {
        return true;
    }
    return false;
}

export function canUserCreateStory(user: User | null, experienceSlug: string) {
    if (!user) return false;
    if (experienceSlug === "universe") return false;
    return isUserPartOfOrganization(user, experienceSlug);
}

export async function canUserEditStory(user: User | null, story: StoryDTO) {
    if (await isUserSuperAdmin(user)) return true;
    if (isStoryOwner(user, story)) return true;
    return false;
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

async function insertElevationRequest(
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

export async function getAllPublicStoriesDTO(): Promise<StoryDTO[]> {
    try {
        const stories = await getAllStories();
        const filteredStories = stories.filter(isPublicStory);
        return filteredStories;
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

export async function getAllStoriesDTO(): Promise<StoryDTO[]> {
    try {
        const user = await getCurrentUser();
        if (!(await isUserSuperAdmin(user))) {
            throw new Error("Unauthorized");
        }
        const stories = await getAllStories();
        return stories;
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
    try {
        const user = await getCurrentUser();
        if (await isUserSuperAdmin(user)) {
            const stories = await getAllStories();
            return stories.filter(
                async (story) => await canUserViewStory(user, story)
            );
        } else if (await isUserMember(user, experienceSlug)) {
            const stories = await getAllStories();
            return stories.filter(
                async (story) => await canUserViewStory(user, story)
            );
        } else {
            throw new Error("Unauthorized");
        }
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

export async function getStoryDTO(id: string): Promise<StoryDTO> {
    try {
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
            throw new Error("You do not have permission to view this story.");
        }

        return queryResult;
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

export async function submitStoryDTO(formData: FormData) {
    try {
        // check if the user has permission to create a story for the given experience
        const experienceSlug = formData.get("slug") as string;
        const user = await getCurrentUser();
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
        console.log("Raw form data:", rawData);
        const processedData = {
            title: rawData.title as string,
            content: rawData.content as string,
            year: parseInt(rawData.year as string, 10),
            longitude: parseFloat(rawData.longitude as string),
            latitude: parseFloat(rawData.latitude as string),
            tags: JSON.parse(rawData.tags as string),
            author: rawData.author as string,
            slug: rawData.slug as string,
            universe: rawData.universe === "true",
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
        const uploadedFileName = `${data.slug}_${nanoid()}_${file.name}`;
        const sanitizedFileName = uploadedFileName.replace(
            /[^a-zA-Z0-9.\-_]/g,
            ""
        );
        const storyToInsert = {
            author: user.id,
            content: data.content,
            title: data.title,
            location: {
                type: "Point",
                coordinates: [data.longitude, data.latitude],
            },
            tags: data.tags,
            year: data.year,
            featured_image_url: sanitizedFileName,
            draft: data.draft,
            visible_universe: data.universe,
            elevation_requests: [
                {
                    status: "created",
                    requested_at: new Date(),
                    resolved_at: new Date(),
                },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        } as NewStoryData;

        // Upload the file and insert the story
        if (process.env.LOCAL_UPLOADER === "true") {
            uploadFileToLabFolder(file, sanitizedFileName, data.slug);
        } else {
            await uploadFile(file, sanitizedFileName, data.slug);
        }
        await insertStory(storyToInsert, data.slug);
        revalidateTag(`stories`);
    } catch (e) {
        console.error("Error submitting story:", e);
    }
}

export async function submitElevationRequestDTO(
    storyID: string,
    user: User | null,
    slug: string,
    status: "created" | "approved" | "rejected" | "pending"
) {
    try {
        if (!isUserAdmin(user, slug)) {
            throw new Error("You must be an admin to request elevation.");
        }
        const requestToInsert: NewElevationRequestData = {
            status: status,
            requested_at: new Date(),
            resolved_at: new Date(),
        };
        await dbConnect();

        // validate id before creating ObjectId
        console.log("Submitting elevation request for story id:", storyID);
        if (!mongoose.Types.ObjectId.isValid(storyID)) {
            throw new Error("Invalid story id format.");
        }

        // parse serializable id to mongoose.Types.ObjectId
        const objectId = new mongoose.Types.ObjectId(storyID);
        await insertElevationRequest(slug, requestToInsert, objectId);
        revalidatePath(`/universe/elevation_requests`);
        revalidatePath(`/${slug}/stories/manage`);
    } catch (err) {
        console.error("Error submitting elevation request:", err);
    }
}
