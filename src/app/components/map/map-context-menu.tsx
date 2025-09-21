"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { setLngLat } from "@/lib/features/dialogue/addStoryDialogSlice";
import { setFlyPosition } from "@/lib/features/map/mapSlice";
import { useAppDispatch } from "@/lib/hooks";
import Link from "next/link";

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
    const dispatch = useAppDispatch();

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
                    <DropdownMenuItem asChild>
                        <Link
                            href={"/stories/create"}
                            scroll={false}
                            prefetch={true}
                            onClick={() =>
                                dispatch(
                                    setLngLat(ptrLngLat ? ptrLngLat : [0, 0])
                                )
                            }
                        >
                            Create story here
                        </Link>
                    </DropdownMenuItem>
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
                    <DropdownMenuItem>Help</DropdownMenuItem>
                </DropdownMenuContent>
            )}
        </DropdownMenu>
    );
}
