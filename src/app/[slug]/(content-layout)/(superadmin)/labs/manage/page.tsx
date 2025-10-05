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
import { Earth } from "lucide-react";

export default async function Page() {
    const data = JSON.stringify(await getExperiencesDTO());

    return (
        <>
            <ContentLayout>
                <Header>
                    <HeaderIcon>
                        <Earth size={80} />
                    </HeaderIcon>
                    <HeaderContent>
                        <HeaderTitle>Manage Heritage Labs</HeaderTitle>
                        <HeaderDescription>
                            Manage the Heritage Labs and all of their stories.
                            Invite new labs and manage existing Heritage Labs.
                        </HeaderDescription>
                    </HeaderContent>
                </Header>
                <ManageExperiencesTable data={data} />
            </ContentLayout>
        </>
    );
}
