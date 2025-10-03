import { DebugSettingsDialog } from "@/app/components/modal/debug-settings-dialog";
import { Suspense } from "react";

export default async function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DebugSettingsDialog />
        </Suspense>
    );
}
