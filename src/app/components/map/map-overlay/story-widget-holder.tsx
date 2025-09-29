"use client";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import {
    setRightSideBarOpen,
    setStoryDetailsOpen,
} from "@/lib/features/navigation/navigationSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ChevronDown, ChevronUp, PanelRightOpen } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function StoryWidgetHolder() {
    const isMobile = useIsMobile();
    const searchParams = useSearchParams();
    const navigationState = useAppSelector((state) => state.navigation);
    const dispatch = useAppDispatch();

    return (
        <div className={"flex flex-row gap-3 pointer-events-auto w-fit"}>
            {searchParams.get("story") !== "" && !isMobile && (
                <Button
                    variant={"secondary_custom"}
                    className={"size-10"}
                    onClick={() => dispatch(setStoryDetailsOpen())}
                >
                    {navigationState.storyDetailsOpen ? (
                        <ChevronDown />
                    ) : (
                        <ChevronUp />
                    )}
                </Button>
            )}
            <Toggle
                onPressedChange={(pressed) =>
                    dispatch(setRightSideBarOpen(pressed))
                }
                pressed={navigationState.rightSideBarOpen}
                variant={"secondary_custom"}
            >
                <div className="hidden lg:inline-block">Explore</div>
                <PanelRightOpen />
            </Toggle>
        </div>
    );
}
