import { StoryHoverCardContent } from "@/app/components/map/map-overlay/story-hover-card-content";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { HoverCardPortal } from "@radix-ui/react-hover-card";
import { Hexagon } from "lucide-react";
import { memo } from "react";

function CustomMarker({
    storyId,
    isActive,
}: {
    storyId: string;
    isActive: boolean;
}) {
    return (
        <HoverCard openDelay={500} closeDelay={100}>
            <HoverCardTrigger>
                <Hexagon
                    data-state={isActive ? "active" : "inactive"}
                    size={20}
                    fill={"#D7263D"}
                    className={cn(
                        "cursor-pointer transition-all size-7 hover:size-9 hover:fill-blue-400 hover:stroke-white data-[state=active]:size-9 data-[state=active]:fill-blue-400 data-[state=active]:stroke-white",
                        {
                            "fill-blue-400": isActive,
                        }
                    )}
                    strokeWidth={1}
                    stroke={"#111"}
                />
            </HoverCardTrigger>
            <HoverCardPortal>
                <StoryHoverCardContent storyId={storyId} />
            </HoverCardPortal>
        </HoverCard>
    );
}

export default memo(CustomMarker);
