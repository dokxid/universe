"use client";

import { Toggle } from "@/components/ui/toggle";
import { setGlobeView } from "@/lib/features/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Globe } from "lucide-react";

export default function ToggleGlobeButton() {
    const dispatch = useAppDispatch();
    const settingsState = useAppSelector((state) => state.settings);
    return (
        <Toggle
            pressed={settingsState.globeView}
            onPressedChange={(pressed) => dispatch(setGlobeView(pressed))}
            className="pointer-events-auto size-10 bg-secondary text-secondary-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:ring-2"
        >
            <Globe />
        </Toggle>
    );
}
