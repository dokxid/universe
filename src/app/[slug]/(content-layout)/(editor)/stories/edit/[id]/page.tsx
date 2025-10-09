import StoryEdit from "@/app/components/views/story-edit";
import { getStoryDTO } from "@/data/dto/story-dto";
import { getTagsDTO } from "@/data/dto/tag-dto";

export default async function StoryDetails({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: storyId } = await params;
    const story = await getStoryDTO(storyId);
    const allTags = await getTagsDTO();

    return <StoryEdit story={story} allTags={allTags} />;
}
