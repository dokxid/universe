import { getLineStringFromLocations } from "@/lib/utils/geo";
import { StoryDTO } from "@/types/dtos";

export type TaggedConnectionDTO = {
    tag: string;
    lineStrings: GeoJSON.LineString[];
};

export function getTagLines(stories: StoryDTO[]): GeoJSON.LineString[] {
    const storiesLocations = stories.map((story) => {
        return {
            longitude: story.location.coordinates[0],
            latitude: story.location.coordinates[1],
        };
    });
    const lineStrings = getLineStringFromLocations(storiesLocations);
    return lineStrings;
}

export function getTagLineStringsDTO(
    stories: StoryDTO[],
    tags: string[]
): TaggedConnectionDTO[] {
    const dtoToReturn: TaggedConnectionDTO[] = [];
    for (const tag of tags) {
        const filteredStories = stories.filter((story) =>
            story.tags.includes(tag)
        );
        const tagLines = getTagLines(filteredStories);
        dtoToReturn.push({
            tag: tag,
            lineStrings: tagLines,
        });
    }
    return dtoToReturn;
}
