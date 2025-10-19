import { elevationRequestsColumns } from "@/app/components/data-tables/columns";
import { ElevationRequestsTable } from "@/app/components/data-tables/elevation-requests-data-table";
import { ContentLayout } from "@/app/components/layout/content-layout";
import {
    Header,
    HeaderContent,
    HeaderDescription,
    HeaderIcon,
    HeaderTitle,
} from "@/app/components/layout/header";
import { getLabPrivateStoriesDTO } from "@/data/dto/getters/get-story-dto";
import { StoryDTO } from "@/types/dtos";
import { ColumnDef } from "@tanstack/react-table";
import { Grid2X2Check } from "lucide-react";

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const data = JSON.stringify(await getLabPrivateStoriesDTO(slug));

    return (
        <>
            <ContentLayout>
                <Header>
                    <HeaderIcon>
                        <Grid2X2Check size={80} />
                    </HeaderIcon>
                    <HeaderContent>
                        <HeaderTitle>Elevation Requests</HeaderTitle>
                        <HeaderDescription>
                            Manage the elevation requests in all labs. Reject or
                            approve them as needed.
                        </HeaderDescription>
                    </HeaderContent>
                </Header>
                <ElevationRequestsTable
                    columns={
                        elevationRequestsColumns as ColumnDef<
                            StoryDTO,
                            unknown
                        >[]
                    }
                    data={data}
                />
            </ContentLayout>
        </>
    );
}
