import dbConnect from "@/lib/data/mongodb/connections";
import unescoTags from "@/lib/data/mongodb/models/unesco-tag-model";
import { UnescoTagDTO, UnescoTagTheme } from "@/types/dtos";
import { cache } from "react";

function sanitizeUNESCOTag(tagToSanitize: UnescoTagTheme): UnescoTagTheme {
    return {
        ...tagToSanitize,
        _id: tagToSanitize._id.toString(),
        categories:
            tagToSanitize.categories?.map((category) => ({
                ...category,
                _id: category._id?.toString(),
                tags:
                    category.tags?.map((tag) => ({
                        ...tag,
                        _id: tag._id?.toString(),
                    })) || [],
            })) || [],
    };
}

export const getTags = cache(async (): Promise<UnescoTagTheme[]> => {
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

export const getTagsDTO = cache(async (): Promise<UnescoTagDTO[]> => {
    const tagThemes = await getTags();
    const tags: UnescoTagDTO[] = [];
    for (const theme of tagThemes) {
        for (const category of theme.categories) {
            for (const tag of category.tags) {
                tags.push({
                    theme: theme.name,
                    category: category.name,
                    name: tag.name,
                    color: theme.color,
                    _id: tag._id,
                });
            }
        }
    }
    return tags;
});

export async function getTagByName(tagName: string): Promise<UnescoTagDTO> {
    const tags = await getTagsDTO();
    const tag = tags.find((t) => t.name === tagName);
    if (!tag) {
        throw new Error("Tag not found: " + tagName);
    }
    return tag;
}
