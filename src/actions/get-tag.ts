"use server";

import { getTagsByNameDTO, getTagsDTO } from "@/data/dto/tag-dto";
import { UnescoTagDTO } from "@/types/dtos";

export async function getTagsByNameAction(
    tagNames: string[]
): Promise<UnescoTagDTO[]> {
    try {
        return await getTagsByNameDTO(tagNames);
    } catch (error) {
        console.error({
            message: `Error fetching tags by name: ${tagNames.join(", ")}`,
            error,
        });
        throw error;
    }
}
export async function getTagsAction(): Promise<UnescoTagDTO[]> {
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
