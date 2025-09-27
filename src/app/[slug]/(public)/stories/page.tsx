import ContentLayout from "@/app/components/layout/content-layout";
import { StoryGallery } from "@/app/components/modal/story-gallery";
import { Suspense } from "react";

export default async function StoriesPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return (
        <ContentLayout slug={slug} feature={"Explore stories"}>
            <Suspense fallback={<div>Loading...</div>}>
                <StoryGallery slug={slug} />
            </Suspense>
        </ContentLayout>
    );
}
