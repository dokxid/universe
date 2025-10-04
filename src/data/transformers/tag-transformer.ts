import { UnescoTagDTO, UnescoTagTheme } from "@/types/dtos";

export function sanitizeUNESCOTag(
    tagToSanitize: UnescoTagTheme
): UnescoTagTheme {
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

export function flattenedTags(tagThemes: UnescoTagTheme[]): UnescoTagDTO[] {
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
}
