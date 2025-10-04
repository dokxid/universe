import { StoryHoverCardContent } from "@/app/components/map/map-overlay/story-hover-card-content";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { StoryDTO } from "@/types/dtos";
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
        <HoverCard openDelay={100} closeDelay={20}>
            <HoverCardTrigger>
                <MapPin
                    size={20}
                    fill={"#D7263D"}
                    className={cn(
                        "cursor-pointer transition-all size-7 hover:size-9 hover:fill-blue-400",
                        {
                            "fill-blue-400": isActive,
                        }
                    )}
                    strokeWidth={0}
                    stroke={"#FFFFFF"}
                />
            </HoverCardTrigger>
            <HoverCardContent>
                <StoryHoverCardContent story={story} />
                <HoverCardArrow />
            </HoverCardContent>
        </HoverCard>
    );
}

export default memo(CustomMarker);
