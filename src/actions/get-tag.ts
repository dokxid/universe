"use server";

import { getTagByNameDTO, getTagsDTO } from "@/data/dto/getters/get-tag-dto";
import { TagDTO } from "@/types/dtos";

export async function getTagByNameAction(
    tagName: string
): Promise<TagDTO | null> {
    try {
        return await getTagByNameDTO(tagName);
    } catch (error) {
        console.error({
            message: `Error fetching tags by name: ${tagName}`,
            error,
        });
        throw error;
    }
}
export async function getTagsAction(): Promise<TagDTO[]> {
    try {
        return await getTagsDTO();
    } catch (error) {
        console.error({
            message: `Error fetching all tags`,
            error,
        });
        throw error;
    }
}
