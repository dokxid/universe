import ContentLayout from "@/app/components/layout/content-layout";
import { UserPreferencesDialog } from "@/app/components/modal/user-preferences-dialog";
import { getCurrentUser } from "@/data/auth";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const user = await getCurrentUser();

    return (
        <ContentLayout slug={slug}>
            <UserPreferencesDialog user={user} />
        </ContentLayout>
    );
}
