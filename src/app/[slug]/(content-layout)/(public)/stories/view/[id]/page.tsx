import StoryView from "@/app/components/views/story-view";
import { getCurrentUserOptional } from "@/data/auth";
import { canUserViewStoryId, getStoryDTO } from "@/data/dto/story-dto";
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
    const user = await getCurrentUserOptional();
    const permissionToView = await canUserViewStoryId(user, storyId);
    if (!permissionToView) {
        return notFound();
    }
    const story = await getStoryDTO(storyId);

    return <StoryView story={story} />;
}
