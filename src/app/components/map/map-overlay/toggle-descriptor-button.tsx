"use client";

import { Button } from "@/components/ui/button";
import { setDescriptorOpen } from "@/lib/features/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ChevronsDownUp } from "lucide-react";

export default function ToggleDescriptorButton({
    visible = true,
}: {
    visible?: boolean;
}) {
    const dispatch = useAppDispatch();
    const settingsState = useAppSelector((state) => state.settings);
    const mapState = useAppSelector((state) => state.map);

    if (mapState.selectedStoryId !== "") {
        return null;
    }

    return !visible ? null : (
        <Button
            onClick={() =>
                dispatch(setDescriptorOpen(!settingsState.descriptorOpen))
            }
            className={`h-10 flex flex-row gap-2 items-center hover:ring-2 ${
                settingsState.descriptorOpen
                    ? "bg-primary text-primary-foreground hover:bg-primary hover:ring-secondary"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary hover:ring-primary"
            }`}
        >
            <ChevronsDownUp className={"size-4"} />
            <p className={"text-xs hidden lg:inline-block"}>
                {settingsState.descriptorOpen
                    ? "Hide details"
                    : "About the Co-Lab"}
            </p>
        </Button>
    );
}
