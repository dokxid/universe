import {memo} from "react";
import {MapPin} from "lucide-react";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";
import {StoryData} from "@/types/api";
import {Interweave} from "interweave";
import S3Image from "@/components/s3Image";


function CustomMarker({story}: { story: StoryData }) {
    return (
        <HoverCard>
            <HoverCardTrigger>
                <MapPin size={30} fill={"#DBA726"} className={"cursor-pointer"}/>
            </HoverCardTrigger>
            <HoverCardContent>
                <S3Image experience={story.experience} fileName={story.featuredImage}/>
                <article className={"prose prose-sm lg:prose-base"}>
                    <h1 className={"font-bold mb-0"}>{story.title}</h1>
                    <Interweave content={story.content}/>
                </article>
            </HoverCardContent>
        </HoverCard>
    );
}

export default memo(CustomMarker);