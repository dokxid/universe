import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import {Dispatch, SetStateAction} from "react";

export function SettingsDialog({isOpen, onOpenChange}: {
    isOpen: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <div key="text-0" id="text-0" className=" col-span-12 col-start-auto">
                            <p className="not-first:mt-6 leading-7">
                                <span className="text-lg font-semibold">Settings</span><br/>
                                <span
                                    className="text-sm text-muted-foreground font-normal">Configure the Application</span>
                            </p>
                        </div>
                    </DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
