"use client";

import { StoryDetails } from "@/app/components/map/map-overlay/story-details";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppSelector } from "@/lib/hooks";
import { StoryDTO } from "@/types/api";
import { ChevronDown, ChevronUp, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";

export function StoryWidgetHolder({
    storiesPromise,
    slug,
}: {
    storiesPromise: Promise<StoryDTO[]>;
    slug: string;
}) {
    const mapState = useAppSelector((state) => state.map);
    const isMobile = useIsMobile();
    const stories = use(storiesPromise);
    const [showDetails, setShowDetails] = useState(true);
    return (
        <div className={"flex flex-col gap-3 items-end h-full"}>
            <div className={"flex flex-row gap-3 pointer-events-auto w-fit"}>
                {mapState.selectedStoryId !== "" && !isMobile && (
                    <Button
                        variant={"secondary_custom"}
                        className={"size-10"}
                        onClick={() => setShowDetails(!showDetails)}
                    >
                        {showDetails ? <ChevronDown /> : <ChevronUp />}
                    </Button>
                )}
                <Link href={`/${slug}/settings`}>
                    <Button variant={"secondary_custom"} className={"size-10"}>
                        <SettingsIcon />
                    </Button>
                </Link>
            </div>
            <StoryDetails stories={stories} open={showDetails} />
        </div>
    );
}
