import ContentLayout from "@/app/components/layout/content-layout";
import { manageStoryColumns } from "@/app/components/stories/columns";
import { StoryDataTable } from "@/app/components/stories/story-data-table";
import { getLabPrivateStoriesDTO } from "@/data/dto/story-dto";
import { StoryDTO } from "@/types/dtos";
import { ColumnDef } from "@tanstack/react-table";
import { Suspense } from "react";

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const data = JSON.stringify(await getLabPrivateStoriesDTO(slug));

    return (
        <div className="w-full @container mx-auto">
            <Suspense fallback={<div>Loading...</div>}>
                <StoryDataTable
                    columns={
                        manageStoryColumns as ColumnDef<StoryDTO, unknown>[]
                    }
                    data={data}
                />
            </Suspense>
        </div>
    );
}
