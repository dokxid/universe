import { Dialog } from "@/app/components/modal/dialog";
import { SettingsDialog } from "@/app/components/modal/settings-dialog";

export default function Page() {
    return (
        <Dialog
            title="Settings"
            description="Configure your preferences below:"
        >
            <SettingsDialog />
        </Dialog>
    );
}
