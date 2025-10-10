import StoryEdit from "@/app/components/views/story-edit";
import { canUserEditStoryId, getStoryDTO } from "@/data/dto/story-dto";
import { getTagsDTO } from "@/data/dto/tag-dto";
import { notFound } from "next/navigation";

export default async function StoryDetails({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: storyId } = await params;
    const isAllowedToEditStory = await canUserEditStoryId(storyId);
    if (!isAllowedToEditStory) {
        return notFound();
    }

    const story = await getStoryDTO(storyId);
    const allTags = await getTagsDTO();

    return <StoryEdit story={story} allTags={allTags} />;
}
