import ContentLayout from "@/app/components/layout/content-layout";
import { PreferencesDialog } from "@/app/components/modal/preferences-dialog";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return (
        <ContentLayout slug={slug}>
            <PreferencesDialog />
        </ContentLayout>
    );
}
