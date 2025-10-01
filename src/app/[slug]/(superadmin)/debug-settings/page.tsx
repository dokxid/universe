import ContentLayout from "@/app/components/layout/content-layout";
import { DebugSettingsDialog } from "@/app/components/modal/debug-settings-dialog";
import { getCurrentUser, isUserSuperAdmin } from "@/data/auth";
import { redirect } from "next/navigation";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const user = await getCurrentUser();
    const isSuperAdmin = await isUserSuperAdmin(user);

    if (!isSuperAdmin) {
        redirect(`/`);
    }

    return (
        <ContentLayout slug={slug} feature={"Settings"}>
            <DebugSettingsDialog />
        </ContentLayout>
    );
}
