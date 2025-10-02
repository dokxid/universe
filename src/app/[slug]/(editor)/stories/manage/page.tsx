import ContentLayout from "@/app/components/layout/content-layout";
import { manageStoryColumns } from "@/app/components/stories/columns";
import { StoryDataTable } from "@/app/components/stories/story-data-table";
import { getLabPrivateStoriesDTO } from "@/data/dto/story-dto";
import { StoryDTO } from "@/types/dtos";
import { ColumnDef } from "@tanstack/react-table";

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const data = JSON.stringify(await getLabPrivateStoriesDTO(slug));

    return (
        <ContentLayout slug={slug}>
            <div className="w-full @container mx-auto">
                <StoryDataTable
                    columns={
                        manageStoryColumns as ColumnDef<StoryDTO, unknown>[]
                    }
                    data={data}
                />
            </div>
        </ContentLayout>
    );
}
