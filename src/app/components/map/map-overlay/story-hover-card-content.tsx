import { TagList } from "@/app/components/cards/tag-list";
import S3Image from "@/app/components/embeds/s3-image";
import { StoryDetailsHeader } from "@/app/components/map/map-overlay/story-details";
import { useAppDispatch } from "@/lib/hooks";
import { setSelectedStoryId } from "@/lib/redux/map/map-slice";
import { StoryDTO } from "@/types/dtos";

export function StoryHoverCardContent({ story }: { story: StoryDTO }) {
    const dispatch = useAppDispatch();
    return (
        <div className={"max-h-[400px] flex flex-col gap-1 overflow-y-auto"}>
            <div
                onClick={() => dispatch(setSelectedStoryId(story._id))}
                className={
                    "relative h-[150px] w-full flex justify-center items-center shrink-0 rounded-md hover:brightness-75 hover:cursor-pointer transition-all duration-200 overflow-hidden"
                }
            >
                <S3Image
                    className={"hover:scale-105 transition-all duration-200"}
                    link={false}
                    experience={story.experience}
                    fileName={story.featured_image_url}
                />
            </div>
            <StoryDetailsHeader
                story={story}
                className={"bg-card"}
                profilePictureVisible={false}
            />
            {story.tags && story.tags.length > 0 && (
                <TagList tags={story.tags} variant={"add"} />
            )}
        </div>
    );
}
