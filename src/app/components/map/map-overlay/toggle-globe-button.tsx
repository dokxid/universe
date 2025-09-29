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
            variant={"secondary_custom"}
        >
            <Globe />
        </Toggle>
    );
}
