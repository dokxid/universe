import "server-only";

import { getLabPublicStoriesDTO } from "@/data/dto/getters/get-story-dto";
import {
    flattenedTags,
    sanitizeUNESCOTag,
} from "@/data/transformers/tag-transformer";
import dbConnect from "@/lib/data/mongodb/connections";
import { UNESCOTagModel } from "@/lib/data/mongodb/models/unesco-tag-model";
import {
    UnescoTagDTO,
    UnescoTagDTOWithCount,
    UnescoTagTheme,
} from "@/types/dtos";
import { cache } from "react";

const getTags = cache(async (): Promise<UnescoTagTheme[]> => {
    try {
        await dbConnect();
        const fetchedUNESCOTags = (await UNESCOTagModel.find({})
            .lean()
            .exec()) as unknown as UnescoTagTheme[];
        return fetchedUNESCOTags.map(sanitizeUNESCOTag);
    } catch (error) {
        console.error("Error fetching tags:", error);
        throw error;
    }
});

// flattened tags for easier access
export const getTagsDTO = cache(async (): Promise<UnescoTagDTO[]> => {
    const tagThemes = await getTags();
    const tags = flattenedTags(tagThemes);
    return tags;
});

export const getTagsForLabDTO = cache(
    async (labSlug: string): Promise<UnescoTagDTOWithCount[]> => {
        const tagThemes = await getTags();
        const stories = await getLabPublicStoriesDTO(labSlug);
        const storyTagNames = stories.flatMap((story) => story.tags || []);
        const tags = flattenedTags(tagThemes);
        const labTags = tags.filter((tag) => storyTagNames.includes(tag.name));
        return labTags.map((tag) => ({
            ...tag,
            count: storyTagNames.filter((name) => name === tag.name).length,
        }));
    }
);

export async function getTagsByNameDTO(
    tagNames: string[]
): Promise<UnescoTagDTO[]> {
    const tags = await getTagsDTO();
    const foundTags = tags.filter((t) => tagNames.includes(t.name));
    if (foundTags.length === 0) {
        throw new Error("Tags not found: " + tagNames.join(", "));
    }
    return foundTags;
}
