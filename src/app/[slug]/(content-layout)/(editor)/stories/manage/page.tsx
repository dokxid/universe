import { manageStoryColumns } from "@/app/components/data-tables/columns";
import { StoryDataTable } from "@/app/components/data-tables/story-data-table";
import { ContentLayout } from "@/app/components/layout/content-layout";
import {
    Header,
    HeaderContent,
    HeaderDescription,
    HeaderIcon,
    HeaderTitle,
} from "@/app/components/layout/header";
import { getLabPrivateStoriesDTO } from "@/data/dto/story-dto";
import { StoryDTO } from "@/types/dtos";
import { ColumnDef } from "@tanstack/react-table";
import { Newspaper } from "lucide-react";
import { Suspense } from "react";

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const data = JSON.stringify(await getLabPrivateStoriesDTO(slug));

    return (
        <>
            <ContentLayout>
                <Header>
                    <HeaderIcon>
                        <Newspaper size={80} />
                    </HeaderIcon>
                    <HeaderContent>
                        <HeaderTitle>Manage Lab Stories</HeaderTitle>
                        <HeaderDescription>
                            Manage the stories in your lab. You can add, remove,
                            or modify story details as needed. Or publish them
                            on the Universe for the world to see!
                        </HeaderDescription>
                    </HeaderContent>
                </Header>
                <Suspense fallback={<div>Loading...</div>}>
                    <StoryDataTable
                        columns={
                            manageStoryColumns as ColumnDef<StoryDTO, unknown>[]
                        }
                        data={data}
                    />
                </Suspense>
            </ContentLayout>
        </>
    );
}
