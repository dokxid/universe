import ContentLayout from "@/app/components/layout/content-layout";
import { DebugSettingsDialog } from "@/app/components/modal/debug-settings-dialog";
import { Suspense } from "react";

export default async function Page() {
    return (
        <ContentLayout>
            <Suspense fallback={<div>Loading...</div>}>
                <DebugSettingsDialog />
            </Suspense>
        </ContentLayout>
    );
}
