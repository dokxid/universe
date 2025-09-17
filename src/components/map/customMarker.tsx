import {memo} from "react";
import {MapPin} from "lucide-react";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";
import {StoryData} from "@/types/api";
import {StoryCardContent} from "@/components/map/storyCardContent";


function CustomMarker({story}: { story: StoryData }) {
    return (
        <HoverCard>
            <HoverCardTrigger>
                <MapPin size={30} fill={"#DBA726"} className={"cursor-pointer"}/>
            </HoverCardTrigger>
            <HoverCardContent>
                <StoryCardContent experience={story.experience} fileName={story.featuredImage} title={story.title}
                                  content={story.content}/>
            </HoverCardContent>
        </HoverCard>
    );
}

export default memo(CustomMarker);