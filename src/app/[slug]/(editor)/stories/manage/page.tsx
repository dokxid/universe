import ContentLayout from "@/app/components/layout/content-layout";
import { columns } from "@/app/components/stories/columns";
import { DataTable } from "@/app/components/stories/manage-story-table";
import { getLabPrivateStoriesDTO } from "@/data/dto/story-dto";
import { StoryDTO } from "@/types/api";

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const data = JSON.stringify(await getLabPrivateStoriesDTO(slug));

    return (
        <ContentLayout slug={slug} feature={"Manage Stories"}>
            <div className="w-full @container mx-auto">
                <DataTable columns={columns} data={data} />
            </div>
        </ContentLayout>
    );
}
