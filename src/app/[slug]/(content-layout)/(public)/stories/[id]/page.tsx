import StoryView from "@/app/components/views/story-view";
import { getCurrentUser } from "@/data/auth";
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
    const user = await getCurrentUser();
    console.log("Fetched user:", user);
    const permissionToView = await canUserViewStoryId(user, storyId);
    console.log("permissionToView:", permissionToView);
    if (!permissionToView) {
        return notFound();
    }
    const story = await getStoryDTO(storyId);

    return <StoryView story={story} />;
}
