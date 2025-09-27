import ContentLayout from "@/app/components/layout/content-layout";
import StoryView from "@/app/components/stories/story-view";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

function StoryViewSkeleton() {
    return (
        <>
            <Skeleton
                className={"w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80"}
            ></Skeleton>
            <div className={"flex flex-col gap-4 h-full p-4 px-8"}>
                <Skeleton className="grow-6 p-4 px-8 min-w-xl"></Skeleton>
                <Skeleton className="grow-4 w-3/4 mb-4"></Skeleton>
                <Skeleton className="grow-5 w-full mb-2"></Skeleton>
            </div>
        </>
    );
}

export default async function StoryDetails({
    params,
}: {
    params: Promise<{ slug: string; id: string }>;
}) {
    const { slug, id: storyId } = await params;

    return (
        <ContentLayout slug={slug} feature={"Experiences"} className={"p-0"}>
            <Suspense fallback={<StoryViewSkeleton />}>
                <StoryView storyId={storyId} />
            </Suspense>
        </ContentLayout>
    );
}
