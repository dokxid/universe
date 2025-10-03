import ContentLayout from "@/app/components/layout/content-layout";
import StoryView from "@/app/components/views/story-view";
import { getAllPublicStoriesDTO } from "@/data/dto/story-dto";

export async function generateStaticParams() {
    const stories = await getAllPublicStoriesDTO();

    return stories.map((story) => ({
        storyId: story._id,
    }));
}

export default async function StoryDetails({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: storyId } = await params;

    return (
        <ContentLayout className={"p-0"}>
            <StoryView storyId={storyId} />
        </ContentLayout>
    );
}
