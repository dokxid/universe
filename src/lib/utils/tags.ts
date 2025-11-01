import { TagDTO } from "@/types/dtos";

export const convertTagNamesToTagDTOs = (
    tags: TagDTO[],
    tagNames: string[]
) => {
    return tags.filter((tag) => tagNames.includes(tag.name));
};
