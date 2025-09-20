import {memo} from "react";
import {MapPin} from "lucide-react";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";
import {StoryData} from "@/types/api";
import {StoryCardContent} from "@/components/map/storyCardContent";
import {HoverCardArrow} from "@radix-ui/react-hover-card";


function CustomMarker({story, experienceSlug}: { story: StoryData, experienceSlug: string }) {
    return (
        <HoverCard>
            <HoverCardTrigger>
                <MapPin size={30} fill={"#DBA726"} className={"cursor-pointer"}/>
            </HoverCardTrigger>
            <HoverCardContent>
                <StoryCardContent experience={"test"} fileName={story.featuredImage} title={story.title}
                                  content={story.content}/>
                <HoverCardArrow/>
            </HoverCardContent>
        </HoverCard>
    );
}

export default memo(CustomMarker);