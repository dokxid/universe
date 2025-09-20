"use client";

import {Dialog as CNDialog, DialogContent, DialogTitle,} from "@/components/ui/dialog";
import {DialogDescription} from "@radix-ui/react-dialog";
import {useRouter} from "next/navigation";
import {ScrollArea} from "../../../components/ui/scroll-area";

export function Dialog({
                           children,
                           title,
                           description,
                       }: {
    children: React.ReactNode;
    title: string;
    description: string;
}) {
    const router = useRouter();
    return (
        <CNDialog
            defaultOpen={true}
            open={true}
            onOpenChange={() => {
                router.back();
            }}
        >
            <DialogContent className={"overflow-y-auto"}>
                <div className={"max-h-[80vh] flex flex-col gap-4"}>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                    <ScrollArea>{children}</ScrollArea>
                </div>
            </DialogContent>
        </CNDialog>
    );
}
