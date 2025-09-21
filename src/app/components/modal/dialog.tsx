"use client";

import {
    Dialog as CNDialog,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

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
            <DialogOverlay />
            <DialogContent className={"overflow-y-auto"}>
                <div className={"max-h-[80vh] flex flex-col gap-4"}>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                    <ScrollArea className="**:focus-visible:!ring-transparent **:focus-visible:shadow-none **:focus-within:shadow-none focus-within:!ring-transparent **:focus-within:ring-0">
                        {children}
                    </ScrollArea>
                </div>
            </DialogContent>
        </CNDialog>
    );
}
