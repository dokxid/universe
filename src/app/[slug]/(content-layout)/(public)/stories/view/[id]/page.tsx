import StoryView from "@/app/components/views/story-view";
import { canUserViewStoryId } from "@/data/dto/auth/story-permissions";
import { getStoryDTO } from "@/data/dto/getters/get-story-dto";
import { notFound } from "next/navigation";

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
    const permissionToView = await canUserViewStoryId(storyId);
    if (!permissionToView) {
        return notFound();
    }
    const story = await getStoryDTO(storyId);

    return <StoryView story={story} />;
}
