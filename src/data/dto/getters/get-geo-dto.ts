import { getLineStringFromLocations } from "@/lib/utils/geo";
import { StoryPinDTO, TagDTO } from "@/types/dtos";

export type TaggedLineConnectionStringDTO = {
    tag: TagDTO;
    lineStrings: GeoJSON.LineString[];
};

export type TaggedConnectionDTO = {
    from: [longitude: number, latitude: number];
    to: [longitude: number, latitude: number];
    tag: TagDTO;
};

export function getTagLines(stories: StoryPinDTO[]): GeoJSON.LineString[] {
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
    stories: StoryPinDTO[],
    tags: TagDTO[]
): TaggedLineConnectionStringDTO[] {
    const allConnections: TaggedLineConnectionStringDTO[] = [];
    for (const tag of tags) {
        const filteredStories = stories.filter(
            (story) => story.tags && story.tags.map((t) => t.name).includes(tag.name)
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
    stories: StoryPinDTO[],
    tags: TagDTO[]
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
                        color: connection.tag.color,
                    };
                });
            }
            return [];
        }
    );
    return connections;
}
