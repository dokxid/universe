import ContentLayout from "@/app/components/layout/content-layout";
import { ListStoriesDialog } from "@/app/components/modal/list-stories-dialog";
import { Suspense } from "react";

export default async function StoriesPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return (
        <ContentLayout slug={slug} feature={"Experiences"}>
            <Suspense fallback={<div>Loading...</div>}>
                <ListStoriesDialog slug={slug} />
            </Suspense>
        </ContentLayout>
    );
}
