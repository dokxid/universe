import AddStoryForm from "@/app/components/form/add-story-form";
import ContentLayout from "@/app/components/layout/content-layout";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return (
        <ContentLayout slug={slug} feature={"Create story"}>
            <AddStoryForm />
        </ContentLayout>
    );
}
