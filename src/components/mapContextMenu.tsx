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
                className="absolute size-auto"
                style={{
                    top: coords.y,
                    left: coords.x,
                    transform: "translate(0, 0)",
                }}
            >
                <DropdownMenuLabel>{ptrLngLat ? ptrLngLat[0].toFixed(4) + ", " + ptrLngLat[1].toFixed(4) : "null"}</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>Create story here</DropdownMenuItem>
                <DropdownMenuItem>Item 2</DropdownMenuItem>
                <DropdownMenuItem>Item 3</DropdownMenuItem>
                <DropdownMenuItem>Help</DropdownMenuItem>
            </DropdownMenuContent>)}
        </DropdownMenu>
    )
}