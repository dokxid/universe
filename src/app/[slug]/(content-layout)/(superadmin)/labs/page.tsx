import { ManageExperiencesTable } from "@/app/components/data-tables/manage-experiences-table";
import { ContentLayout } from "@/app/components/layout/content-layout";
import {
    Header,
    HeaderContent,
    HeaderDescription,
    HeaderIcon,
    HeaderTitle,
} from "@/app/components/layout/header";
import { getExperiencesDTO } from "@/data/dto/experience-dto";
import { Newspaper } from "lucide-react";

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const data = JSON.stringify(await getExperiencesDTO());

    return (
        <>
            <ContentLayout>
                <Header>
                    <HeaderIcon>
                        <Newspaper size={80} />
                    </HeaderIcon>
                    <HeaderContent>
                        <HeaderTitle>Elevation Requests</HeaderTitle>
                        <HeaderDescription>
                            Manage the elevation requests in all labs. Reject or
                            approve them as needed.
                        </HeaderDescription>
                    </HeaderContent>
                </Header>
                <ManageExperiencesTable data={data} />
            </ContentLayout>
        </>
    );
}
