import StoryView from "@/app/components/views/story-view";
import { getStoryDTO } from "@/data/dto/story-dto";

// export async function generateStaticParams() {
//     const stories = await getAllPublicStoriesDTO();

//     return stories.map((story) => ({
//         storyId: story._id,
//     }));
// }

export default async function StoryDetails({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: storyId } = await params;
    const story = await getStoryDTO(storyId);

    return <StoryView story={story} />;
}
