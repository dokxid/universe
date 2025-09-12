import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";


interface MapContextMenuProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    coords?: { x: number; y: number } | null;
    ptrLngLat?: [number, number] | null;
}

export function MapContextMenu({coords, open, onOpenChange, ptrLngLat}: MapContextMenuProps) {
    return (
        <DropdownMenu open={open} onOpenChange={onOpenChange}>
            <div/>
            {coords && (<DropdownMenuContent
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
                <DropdownMenuLabel>{ptrLngLat ? ptrLngLat[0].toFixed(4) + ", " + ptrLngLat[1].toFixed(4) : "null"}</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>Create story here</DropdownMenuItem>
                <DropdownMenuItem>Copy location</DropdownMenuItem>
                <DropdownMenuItem>Help</DropdownMenuItem>
            </DropdownMenuContent>)}
        </DropdownMenu>
    )
}