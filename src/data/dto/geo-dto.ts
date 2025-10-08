import { getLineStringFromLocations } from "@/lib/utils/geo";
import { StoryDTO } from "@/types/dtos";

export type TaggedLineConnectionStringDTO = {
    tag: string;
    lineStrings: GeoJSON.LineString[];
};

type TaggedConnectionDTO = {
    from: [longitude: number, latitude: number];
    to: [longitude: number, latitude: number];
    tag: string;
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

export function getTagLineStrings(
    stories: StoryDTO[],
    tags: string[]
): TaggedLineConnectionStringDTO[] {
    const allConnections: TaggedLineConnectionStringDTO[] = [];
    for (const tag of tags) {
        const filteredStories = stories.filter((story) =>
            story.tags.includes(tag)
        );
        const tagLines = getTagLines(filteredStories);
        allConnections.push({
            tag: tag,
            lineStrings: tagLines,
        });
    }
    return allConnections;
}

export function getTaggedConnectionDTO(
    stories: StoryDTO[],
    tags: string[]
): TaggedConnectionDTO[] {
    const lineStrings: TaggedLineConnectionStringDTO[] = getTagLineStrings(
        stories,
        tags
    );
    const connections: TaggedConnectionDTO[] = lineStrings.flatMap(
        (connection) => {
            if (tags.includes(connection.tag)) {
                return connection.lineStrings.map((lineString) => {
                    const coords = lineString.coordinates;
                    return {
                        from: coords[0] as [number, number],
                        to: coords[1] as [number, number],
                        tag: connection.tag,
                    };
                });
            }
            return [];
        }
    );
    return connections;
}
