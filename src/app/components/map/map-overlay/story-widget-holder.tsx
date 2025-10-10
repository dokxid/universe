"use client";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setRightSideBarOpen } from "@/lib/redux/navigation/navigation-slice";
import { Compass } from "lucide-react";

export function StoryWidgetHolder({ slug }: { slug: string }) {
    const navigationState = useAppSelector((state) => state.navigation);
    const dispatch = useAppDispatch();

    if (slug !== "universe") {
        return null;
    }

    return (
        <div className={"flex flex-row gap-3 pointer-events-auto w-fit"}>
            {/* {searchParams.get("story") !== "" && !isMobile && (
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
            )} */}
            {slug === "universe" && (
                <Button
                    data-state={
                        navigationState.rightSideBarOpen ? "open" : "closed"
                    }
                    onClick={() =>
                        dispatch(
                            setRightSideBarOpen(
                                !navigationState.rightSideBarOpen
                            )
                        )
                    }
                    variant={"secondary_custom"}
                    className={
                        "group/button flex flex-row gap-2 items-center h-10 hover:ring-2"
                    }
                >
                    <p className={"text-xs hidden lg:inline-block"}>Explore</p>
                    <Compass />
                </Button>
            )}
        </div>
    );
}
