import {
    Dialog as CNDialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogDescription } from "@radix-ui/react-dialog";

export function DialogSkeleton({ children }: { children: React.ReactNode }) {
    return (
        <CNDialog defaultOpen={true} open={true}>
            <DialogContent className={"overflow-y-auto"}>
                <div className={"max-h-[80vh] flex flex-col gap-4"}>
                    <DialogTitle />
                    <DialogDescription />
                    <Skeleton className={"h-6 w-1/2"} />
                    <Skeleton className={"h-4 w-full"} />
                    <ScrollArea>{children}</ScrollArea>
                </div>
            </DialogContent>
        </CNDialog>
    );
}
