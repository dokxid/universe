"use client";

import { StoryDetails } from "@/app/components/map/map-overlay/story-details";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { setRightSideBarOpen } from "@/lib/features/navigation/navigationSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { StoryDTO } from "@/types/api";
import { ChevronDown, ChevronUp, PanelRightOpen } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";

export function StoryWidgetHolder({
    storiesPromise,
}: {
    storiesPromise: Promise<StoryDTO[]>;
}) {
    const isMobile = useIsMobile();
    const stories = use(storiesPromise);
    const searchParams = useSearchParams();
    const navigationState = useAppSelector((state) => state.navigation);
    const dispatch = useAppDispatch();
    const [showDetails, setShowDetails] = useState(true);
    const [activeStory, setActiveStory] = useState<StoryDTO | null>(null);

    useEffect(() => {
        if (searchParams.get("story") === "") {
            setActiveStory(null);
        } else {
            setActiveStory(
                stories.find(
                    (story) => story._id === searchParams.get("story")
                ) || null
            );
        }
    }, [searchParams, stories]);

    return (
        <div className={"flex flex-col gap-3 items-end h-full"}>
            <div className={"flex flex-row gap-3 pointer-events-auto w-fit"}>
                {searchParams.get("story") !== "" && !isMobile && (
                    <Button
                        variant={"secondary_custom"}
                        className={"size-10"}
                        onClick={() => setShowDetails(!showDetails)}
                    >
                        {showDetails ? <ChevronDown /> : <ChevronUp />}
                    </Button>
                )}
                <Toggle
                    onPressedChange={(pressed) =>
                        dispatch(setRightSideBarOpen(pressed))
                    }
                    pressed={navigationState.rightSideBarOpen}
                    variant={"secondary_custom"}
                >
                    Explore Heritage Labs
                    <PanelRightOpen />
                </Toggle>
            </div>
            <StoryDetails story={activeStory} open={showDetails} />
        </div>
    );
}
