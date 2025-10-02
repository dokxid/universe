import ContentLayout from "@/app/components/layout/content-layout";
import { StoryGallery } from "@/app/components/modal/story-gallery";

export const experimental_ppr = true;

export default async function StoriesPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return (
        <ContentLayout slug={slug}>
            <StoryGallery slug={slug} />
        </ContentLayout>
    );
}
