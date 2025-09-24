import ContentLayout from "@/app/components/layout/content-layout";
import { elevationRequestColumns } from "@/app/components/stories/columns";
import { StoryDataTable } from "@/app/components/stories/story-data-table";
import { getLabPrivateStoriesDTO } from "@/data/dto/story-dto";

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const data = JSON.stringify(await getLabPrivateStoriesDTO(slug));

    return (
        <ContentLayout slug={slug} feature={"Elevation requests"}>
            <div className="w-full @container mx-auto">
                <StoryDataTable columns={elevationRequestColumns} data={data} />
            </div>
        </ContentLayout>
    );
}
