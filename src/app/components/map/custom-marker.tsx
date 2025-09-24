import { StoryCardContent } from "@/app/components/map/map-overlay/story-card-content";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { StoryDTO } from "@/types/api";
import { HoverCardArrow } from "@radix-ui/react-hover-card";
import { MapPin } from "lucide-react";
import { memo } from "react";

function CustomMarker({
    story,
    isActive,
}: {
    story: StoryDTO;
    isActive: boolean;
}) {
    return (
        <HoverCard openDelay={30}>
            <HoverCardTrigger>
                <MapPin
                    size={30}
                    fill={"#D7263D"}
                    className={cn(
                        "cursor-pointer transition-all size-8 hover:size-10 hover:fill-blue-400",
                        {
                            "fill-blue-400": isActive,
                        }
                    )}
                    strokeWidth={0}
                    stroke={"#FFFFFF"}
                />
            </HoverCardTrigger>
            <HoverCardContent>
                <StoryCardContent story={story} />
                <HoverCardArrow />
            </HoverCardContent>
        </HoverCard>
    );
}

export default memo(CustomMarker);
