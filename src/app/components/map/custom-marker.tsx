import { StoryCardContent } from "@/app/components/map/map-overlay/story-card-content";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Story } from "@/types/api";
import { HoverCardArrow } from "@radix-ui/react-hover-card";
import { MapPin } from "lucide-react";
import { memo } from "react";

function CustomMarker({ story }: { story: Story }) {
    return (
        <HoverCard>
            <HoverCardTrigger>
                <MapPin
                    size={30}
                    fill={"#D7263D"}
                    className={"cursor-pointer"}
                    strokeWidth={1}
                    stroke={"#FFFFFF"}
                />
            </HoverCardTrigger>
            <HoverCardContent>
                <StoryCardContent
                    experience={"test"}
                    fileName={story.featured_image_url}
                    title={story.title}
                    content={story.content}
                />
                <HoverCardArrow />
            </HoverCardContent>
        </HoverCard>
    );
}

export default memo(CustomMarker);
