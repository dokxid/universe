import ContentLayout from "@/app/components/layout/content-layout";
import { PreferencesDialog } from "@/app/components/modal/preferences-dialog";
import { Suspense } from "react";

export default async function Page() {
    return (
        <ContentLayout>
            <Suspense fallback={<div>Loading...</div>}>
                <PreferencesDialog />
            </Suspense>
        </ContentLayout>
    );
}
