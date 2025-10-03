import { StoryDTO } from "@/types/dtos";

export function buildStoryLink(story: StoryDTO) {
    return `/${story.experience}/stories/view/${story._id}`;
}

export function buildExperienceLink(experienceSlug: string) {
    return `/${experienceSlug}/map`;
}
