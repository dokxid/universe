import "server-only";

import { getTags, getTagsForLab } from "@/data/fetcher/tag-fetcher";
import { TagDTO } from "@/types/dtos";
import { cache } from "react";

// flattened tags for easier access
export const getTagsDTO = cache(async (): Promise<TagDTO[]> => {
    try {
        const tags = await getTags();
        const sanitizedTags = tags.map((tag) => sanitizeToTagDTO(tag));
        return sanitizedTags;
    } catch (error) {
        console.error("Error fetching tags DTO:", error);
        throw error;
    }
});

export const getUniqueTagDTOsForLab = cache(
    async (slug: string): Promise<TagDTO[]> => {
        try {
            const tags = await getTagsForLab(slug);
            const sanitizedTags = tags.map((tag) => sanitizeToTagDTO(tag));
            return sanitizedTags;
        } catch (error) {
            console.error("Error fetching unique tags for lab:", error);
            throw error;
        }
    },
);

export async function getTagByNameDTO(tagName: string): Promise<TagDTO | null> {
    try {
        const tags = await getTagsDTO();
        const foundTag = tags.find((t) => t.name === tagName);
        if (!foundTag) {
            throw new Error("Tag not found: " + tagName);
        }
        return foundTag;
    } catch (error) {
        console.error(`Error fetching tag by name: ${tagName}`, error);
        throw error;
    }
}

export function sanitizeToTagDTO(
    tag: TagDTO & { _count: { stories: number } },
): TagDTO {
    return {
        ...tag,
        count: tag._count.stories,
    };
}
