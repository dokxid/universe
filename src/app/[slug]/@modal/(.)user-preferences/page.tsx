import { Dialog } from "@/app/components/modal/dialog";
import { UserPreferencesDialog } from "@/app/components/modal/user-preferences-dialog";

export default function Page() {
    return (
        <Dialog
            title="User Preferences"
            description="Configure your preferences below:"
        >
            <UserPreferencesDialog />
        </Dialog>
    );
}
