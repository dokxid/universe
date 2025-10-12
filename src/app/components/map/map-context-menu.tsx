"use client";

import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppDispatch } from "@/lib/hooks";
import { setFlyPosition } from "@/lib/redux/map/map-slice";
import { useAllowedToAddStory } from "@/lib/swr/user-hook";
import { setLngLatParams } from "@/lib/utils/param-setter";
import { ClipboardCopy, FilePlus2, Plane } from "lucide-react";
import { usePathname } from "next/navigation";

interface MapContextMenuProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    coords?: { x: number; y: number } | null;
    ptrLngLat?: [number, number] | null;
}

function copyToClipboard(text: string) {
    navigator.clipboard
        .writeText(text)
        .then(() => alert("Copied to clipboard: " + text));
}

export function MapContextMenu({
    coords,
    open,
    onOpenChange,
    ptrLngLat,
}: MapContextMenuProps) {
    const isMobile = useIsMobile();
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const slug = pathname.split("/")[1];
    const isUniverse = slug === "universe";
    const { allowedToAddStory, isLoading: isLoadingAllowedToAddStory } =
        useAllowedToAddStory(slug);

    if (isLoadingAllowedToAddStory) return null;

    if (isMobile)
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Marker actions</DrawerTitle>
                        <DrawerDescription>
                            {ptrLngLat
                                ? ptrLngLat[0].toFixed(4) +
                                  ", " +
                                  ptrLngLat[1].toFixed(4)
                                : "null"}{" "}
                        </DrawerDescription>
                    </DrawerHeader>
                    <div
                        className={
                            "flex flex-row gap-2 p-4 text-xs text-wrap w-full *:basis-0 *:grow"
                        }
                    >
                        {!isUniverse && allowedToAddStory && (
                            <Button
                                className={
                                    "flex flex-col h-fit gap-3 p-4 font-semibold"
                                }
                                variant={"default"}
                                onClick={() =>
                                    setLngLatParams(
                                        pathname,
                                        new URLSearchParams(),
                                        ptrLngLat ? ptrLngLat : [0, 0]
                                    )
                                }
                            >
                                Create
                                <FilePlus2 className={"size-8"} />
                            </Button>
                        )}
                        <Button
                            className={"flex flex-col h-fit gap-3 p-4"}
                            variant={"default"}
                            onClick={() =>
                                copyToClipboard(
                                    ptrLngLat
                                        ? ptrLngLat[0].toFixed(4) +
                                              ", " +
                                              ptrLngLat[1].toFixed(4)
                                        : "null"
                                )
                            }
                        >
                            <p className={"font-semibold"}>Copy</p>
                            <ClipboardCopy className={"size-8"} />
                        </Button>
                        <Button
                            className={"flex flex-col h-fit gap-3 p-4"}
                            variant={"default"}
                            onClick={() =>
                                dispatch(
                                    setFlyPosition([
                                        Math.floor(Math.random() * 360),
                                        Math.floor(Math.random() * 180 - 90),
                                    ])
                                )
                            }
                        >
                            <p className={"font-semibold"}>Fly</p>
                            <Plane className={"size-8"} />
                        </Button>
                    </div>
                </DrawerContent>
            </Drawer>
        );

    return (
        <DropdownMenu open={open} onOpenChange={onOpenChange}>
            {coords && (
                <DropdownMenuContent
                    align="start"
                    side="right"
                    sideOffset={0}
                    className="absolute w-2xs"
                    style={{
                        top: coords.y,
                        left: coords.x,
                        transform: "translate(0, 0)",
                    }}
                >
                    <DropdownMenuLabel>
                        {ptrLngLat
                            ? ptrLngLat[0].toFixed(4) +
                              ", " +
                              ptrLngLat[1].toFixed(4)
                            : "null"}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {!isUniverse && allowedToAddStory && (
                        <DropdownMenuItem asChild>
                            <div
                                onClick={() =>
                                    setLngLatParams(
                                        "stories/create",
                                        new URLSearchParams(),
                                        ptrLngLat ? ptrLngLat : [0, 0]
                                    )
                                }
                            >
                                Create story here
                            </div>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                        onClick={() =>
                            copyToClipboard(
                                ptrLngLat
                                    ? ptrLngLat[0].toFixed(4) +
                                          ", " +
                                          ptrLngLat[1].toFixed(4)
                                    : "null"
                            )
                        }
                    >
                        Copy location
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() =>
                            dispatch(
                                setFlyPosition([
                                    Math.floor(Math.random() * 360),
                                    Math.floor(Math.random() * 180 - 90),
                                ])
                            )
                        }
                    >
                        Fly to random location
                    </DropdownMenuItem>
                </DropdownMenuContent>
            )}
        </DropdownMenu>
    );
}
