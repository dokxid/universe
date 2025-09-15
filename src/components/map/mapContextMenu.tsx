import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {useAppDispatch} from "@/lib/hooks";
import {setFlyPosition} from "@/lib/features/map/map";
import {setAddStoryDialogOpen, setLngLat} from "@/lib/features/dialogue/addStoryDialog";


interface MapContextMenuProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    coords?: { x: number; y: number } | null;
    ptrLngLat?: [number, number] | null;
}

function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => alert("Copied to clipboard: " + text))
}

export function MapContextMenu({coords, open, onOpenChange, ptrLngLat}: MapContextMenuProps) {

    const dispatch = useAppDispatch()

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
                <DropdownMenuItem onClick={() => {
                    dispatch(setLngLat(ptrLngLat ? ptrLngLat : [0, 0]))
                    dispatch(setAddStoryDialogOpen())
                }}>Create story here</DropdownMenuItem>
                <DropdownMenuItem onClick={() =>
                    copyToClipboard(ptrLngLat ? ptrLngLat[0].toFixed(4)
                        + ", " + ptrLngLat[1].toFixed(4) : "null"
                    )}>Copy location</DropdownMenuItem>
                <DropdownMenuItem onClick={() =>
                    dispatch(setFlyPosition([
                        Math.floor(Math.random() * 360),
                        Math.floor(Math.random() * 180 - 90)
                    ]))}>Fly to random location</DropdownMenuItem>
                <DropdownMenuItem>Help</DropdownMenuItem>
            </DropdownMenuContent>)}
        </DropdownMenu>
    )
}