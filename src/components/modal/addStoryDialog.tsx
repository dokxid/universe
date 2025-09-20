import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import {Dispatch, SetStateAction} from "react";
import AddStoryForm from "@/components/form/addStoryForm";

export function AddStoryDialog({isOpen, onOpenChange}: {
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
                                <span className="text-lg font-semibold">Add your story</span><br/>
                                <span className="text-sm text-muted-foreground font-normal">Enter your story details below:</span>
                            </p>
                        </div>
                    </DialogTitle>
                </DialogHeader>
                <AddStoryForm/>
            </DialogContent>
        </Dialog>
    )
}