import { Dialog } from "@/app/components/modal/dialog";
import { MapSettingsDialog } from "@/app/components/modal/map-settings-dialog";

export default function Page() {
    return (
        <Dialog
            title="Map Settings"
            description="Configure your preferences below:"
        >
            <MapSettingsDialog />
        </Dialog>
    );
}
