"use client";

import { TagList } from "@/app/components/cards/tag-list";
import { HostedImage } from "@/app/components/embeds/s3-image";
import { StoryAuthorHeaderMapView } from "@/app/components/layout/story-author-details";
import { HoverCardContent } from "@/components/ui/hover-card";
import { useStory } from "@/lib/swr/story-hook";
import { setSelectedStoryIdParams } from "@/lib/utils/param-setter";
import { usePathname, useSearchParams } from "next/navigation";

export function StoryHoverCardContent({ storyId }: { storyId: string }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { story, isLoading, isError } = useStory(storyId);
    if (isLoading || isError || !story) {
        return null;
    }
    return (
        <HoverCardContent className={"p-0 border-none bg-transparent"}>
            <div
                className={
                    "relative h-[400px] flex flex-col gap-1 overflow-y-auto hover:outline-2 outline-white dark:outline-accent-blue-foreground rounded-2xl shadow-lg"
                }
            >
                <div
                    className={
                        "relative h-full w-full overflow-hidden group/card"
                    }
                    onClick={() => {
                        setSelectedStoryIdParams(
                            pathname,
                            searchParams,
                            story.id
                        );
                    }}
                >
                    <HostedImage
                        className={
                            "group-hover/card:scale-105 transition-all duration-200 brightness-40 cursor-pointer"
                        }
                        fileName={story.featuredImageUrl}
                    />
                    <StoryAuthorHeaderMapView
                        story={story}
                        className={
                            "absolute top-2 left-4 right-4 bg-transparent [&_h3]:text-md [&_h3]:group-hover/card:font-black [&_h3]:group-hover/card:after:content-['_→'] [&_p]:text-xs [&_p]:font-medium **:text-white"
                        }
                        profilePictureVisible={false}
                        lines={2}
                        forceWhiteText={true}
                    />
                </div>
                <div className={"absolute bottom-2 left-4 right-4"}>
                    <p className={"prose-group-label -mb-2 text-white"}>
                        Tags:
                    </p>
                    {story.tags && story.tags.length > 0 && (
                        <TagList
                            tags={story.tags}
                            variant={"add"}
                            size={"sm"}
                        />
                    )}
                </div>
            </div>
        </HoverCardContent>
    );
}
