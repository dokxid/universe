import ContentLayout from "@/app/components/layout/content-layout";
import { SettingsDialog } from "@/app/components/modal/settings-dialog";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return (
        <ContentLayout slug={slug} feature={"Settings"}>
            <SettingsDialog />
        </ContentLayout>
    );
}
