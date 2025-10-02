import S3Image from "@/app/components/embeds/s3-image";
import { StoryDetailsHeader } from "@/app/components/map/map-overlay/story-details";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "@/lib/hooks";
import { setSelectedStoryId } from "@/lib/redux/map/mapSlice";
import { getTagColorHex } from "@/lib/utils/color-string";
import { StoryDTO, UnescoTagDTO } from "@/types/dtos";
import Link from "next/link";

export function StoryHoverCardContent({
    tags,
    story,
}: {
    tags: UnescoTagDTO[];
    story: StoryDTO;
}) {
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
                <div className={"flex flex-row flex-wrap gap-x-1 gap-y-2 mb-3"}>
                    {story.tags.map((tag) => (
                        <Badge
                            style={{
                                backgroundColor: getTagColorHex(tags, tag),
                            }}
                            variant={"tag"}
                            key={tag}
                        >
                            <Link href={`/tags/${tag}`}>{tag}</Link>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}
