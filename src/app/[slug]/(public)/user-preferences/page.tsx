import ContentLayout from "@/app/components/layout/content-layout";
import { UserPreferencesDialog } from "@/app/components/modal/user-preferences-dialog";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return (
        <ContentLayout slug={slug} feature={"Settings"}>
            <UserPreferencesDialog />
        </ContentLayout>
    );
}
