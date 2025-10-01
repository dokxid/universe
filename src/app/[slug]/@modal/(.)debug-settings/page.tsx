import { DebugSettingsDialog } from "@/app/components/modal/debug-settings-dialog";
import { Dialog } from "@/app/components/modal/dialog";
import { getCurrentUser, isUserSuperAdmin } from "@/data/auth";
import { redirect } from "next/navigation";

export default async function Page() {
    const user = await getCurrentUser();
    const isSuperAdmin = await isUserSuperAdmin(user);
    console.log(isSuperAdmin);

    if (!isSuperAdmin) {
        redirect(`/`);
    }

    return (
        <Dialog
            title="Debug Settings"
            description="Configure debug settings below:"
        >
            <DebugSettingsDialog />
        </Dialog>
    );
}
