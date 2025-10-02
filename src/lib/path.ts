import { StoryDTO } from "@/types/dtos";

export function buildStoryLink(story: StoryDTO) {
    return `/${story.experience}/stories/view/${story._id}`;
}

export function buildExperienceLink(experienceSlug: string) {
    return `/${experienceSlug}/map`;
}

export const pathFeatures = new Map<string, string>([
    ["map", "Map"],
    ["stories", "Story collection"],
    ["team", "Team"],
    ["about", "About"],
    ["experiences", "Heritage Labs"],
    ["map-settings", "Map settings"],
    ["user-preferences", "User preferences"],
    ["debug-settings", "Debug settings"],
    ["elevation-requests", "Elevation requests"],
]);
