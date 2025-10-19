import { Dialog } from "@/app/components/dialog/dialog";
import { MapSettingsDialog } from "@/app/components/dialog/map-settings-dialog";

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
