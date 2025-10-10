"use client";

import { Toggle } from "@/components/ui/toggle";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setGlobeView } from "@/lib/redux/settings/settings-slice";
import { Globe } from "lucide-react";

export default function ToggleGlobeButton() {
    const dispatch = useAppDispatch();
    const settingsState = useAppSelector((state) => state.settings);
    return (
        <Toggle
            pressed={settingsState.globeView}
            onPressedChange={(pressed) => dispatch(setGlobeView(pressed))}
            variant={"secondary_custom"}
            size={"icon-lg"}
        >
            <Globe />
        </Toggle>
    );
}
