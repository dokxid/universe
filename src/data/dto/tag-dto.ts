import {
    flattenedTags,
    sanitizeUNESCOTag,
} from "@/data/transformers/tag-transformer";
import dbConnect from "@/lib/data/mongodb/connections";
import unescoTags from "@/lib/data/mongodb/models/unesco-tag-model";
import { UnescoTagDTO, UnescoTagTheme } from "@/types/dtos";
import { cache } from "react";

const getTags = cache(async (): Promise<UnescoTagTheme[]> => {
    try {
        await dbConnect();
        const fetchedUNESCOTags = (await unescoTags
            .find({})
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
