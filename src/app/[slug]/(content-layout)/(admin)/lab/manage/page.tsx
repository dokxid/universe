import { ManageUsersTable } from "@/app/components/data-tables/manage-users-table";
import { ContentLayout } from "@/app/components/layout/content-layout";
import {
    Header,
    HeaderContent,
    HeaderDescription,
    HeaderIcon,
    HeaderTitle,
} from "@/app/components/layout/header";
import { getUsersByLabDTO } from "@/data/dto/user-dto";
import { Users } from "lucide-react";
import { Suspense } from "react";

export default async function ManageTeamPage({
    params,
}: {
    params: { slug: string };
}) {
    const { slug } = await params;
    const data = JSON.stringify(await getUsersByLabDTO(slug));
    return (
        <>
            <ContentLayout>
                <Header>
                    <HeaderIcon>
                        <Users size={80} />
                    </HeaderIcon>
                    <HeaderContent>
                        <HeaderTitle>Manage Lab Members</HeaderTitle>
                        <HeaderDescription>
                            Manage the members of your lab. You can add, remove,
                            or modify user roles as needed.
                        </HeaderDescription>
                    </HeaderContent>
                </Header>
                <Suspense fallback={<div>Loading...</div>}>
                    <ManageUsersTable data={data} slug={slug} />
                </Suspense>
            </ContentLayout>
        </>
    );
}
