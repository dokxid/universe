"use client";

import {
    Dialog as CNDialog,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

export function Dialog({
    children,
    title,
    description,
}: {
    children: React.ReactNode;
    title: string;
    description: string;
}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const isMobile = useIsMobile();

    if (!isMobile) {
        return (
            <CNDialog
                defaultOpen={true}
                open={true}
                onOpenChange={() => {
                    router.back();
                }}
            >
                <DialogOverlay />
                <DialogContent
                    showOpenButton={true}
                    openHref={pathname + "?" + searchParams.toString()}
                    className={"overflow-y"}
                >
                    <div className={"max-h-[80vh] flex flex-col gap-4"}>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                        <Separator />
                        <ScrollArea className="overflow-y-auto **:focus-visible:!ring-transparent **:focus-visible:shadow-none **:focus-within:shadow-none focus-within:!ring-transparent **:focus-within:ring-0">
                            {children}
                        </ScrollArea>
                    </div>
                </DialogContent>
            </CNDialog>
        );
    }

    return (
        <Drawer open={true} onOpenChange={() => router.back()}>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                    <DrawerDescription>{description}</DrawerDescription>
                </DrawerHeader>
                <ScrollArea className="p-6 **:focus-visible:!ring-transparent **:focus-visible:shadow-none **:focus-within:shadow-none focus-within:!ring-transparent **:focus-within:ring-0">
                    {children}
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
}
