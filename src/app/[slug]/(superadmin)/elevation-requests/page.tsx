import ContentLayout from "@/app/components/layout/content-layout";
import { elevationRequestsColumns } from "@/app/components/stories/columns";
import { ElevationRequestsTable } from "@/app/components/stories/elevation-requests-data-table";
import { getLabPrivateStoriesDTO } from "@/data/dto/story-dto";
import { StoryDTO } from "@/types/api";
import { ColumnDef } from "@tanstack/react-table";

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const data = JSON.stringify(await getLabPrivateStoriesDTO(slug));

    return (
        <ContentLayout slug={slug} feature={"Elevation requests"}>
            <div className="w-full @container mx-auto">
                <ElevationRequestsTable
                    columns={
                        elevationRequestsColumns as ColumnDef<
                            StoryDTO,
                            unknown
                        >[]
                    }
                    data={data}
                />
            </div>
        </ContentLayout>
    );
}
