import { PreferencesDialog } from "@/app/components/modal/preferences-dialog";
import { Suspense } from "react";

export default async function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PreferencesDialog />
        </Suspense>
    );
}
