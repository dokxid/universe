import { Dialog } from "@/app/components/modal/dialog";
import { PreferencesDialog } from "@/app/components/modal/preferences-dialog";

export default function Page() {
    return (
        <Dialog
            title="Settings"
            description="Configure your preferences below:"
        >
            <PreferencesDialog />
        </Dialog>
    );
}
