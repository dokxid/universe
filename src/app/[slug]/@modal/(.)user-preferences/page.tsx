import { Dialog } from "@/app/components/modal/dialog";
import { UserPreferencesDialog } from "@/app/components/modal/user-preferences-dialog";
import { getCurrentUser } from "@/data/auth";

export default async function Page() {
    const user = await getCurrentUser();
    return (
        <Dialog
            title="User Preferences"
            description="Configure your preferences below:"
        >
            <UserPreferencesDialog user={user} />
        </Dialog>
    );
}
