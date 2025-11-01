import { StoryDTO } from "@/types/dtos";

export function buildStoryLink(story: StoryDTO) {
    return `/${story.lab.slug}/stories/view/${story.id}`;
}

export function buildExperienceLink(experienceSlug: string) {
    return `/${experienceSlug}/map`;
}
