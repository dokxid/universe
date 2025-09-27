"use client";

import S3Image from "@/app/components/s3-image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { StoryDTO } from "@/types/api";
import parse from "html-react-parser";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

function StoryDetailsHeader({
    story,
    className,
}: {
    story: StoryDTO;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "flex flex-row items-center mb-2 justify-between sticky py-3 top-0",
                className
            )}
        >
            <div className={"flex flex-row items-center gap-3"}>
                <Avatar>
                    <AvatarFallback>
                        {story.author_name.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <article className={"flex flex-col text-left gap-1"}>
                    <Link
                        href={
                            "/" +
                            story.experience +
                            "/stories/view/" +
                            story._id
                        }
                    >
                        <p
                            className={
                                "font-semibold line-clamp-2 leading-none overflow-visible hover:underline"
                            }
                        >
                            {story.title}
                        </p>
                    </Link>
                    <p
                        className={
                            "text-sm text-muted-foreground hover:underline cursor-pointer"
                        }
                    >
                        by {story.author_name}
                    </p>
                </article>
            </div>
            <Link href={"/" + story.experience + "/stories/view/" + story._id}>
                <Button
                    variant={"ghost"}
                    className={"p-0 text-xs text-muted-foreground"}
                >
                    <ExternalLink className={"size-4"} />
                </Button>
            </Link>
        </div>
    );
}

export function StoryDetails({
    stories,
    open,
    setOpenAction,
}: {
    stories: StoryDTO[];
    open: boolean;
    setOpenAction: (open: boolean) => void;
}) {
    const isMobile = useIsMobile();
    const mapState = useAppSelector((state) => state.map);
    const parsedStories = stories;
    const story: StoryDTO | undefined = useMemo(() => {
        if (mapState.selectedStoryId === "") return undefined;
        return parsedStories.find(
            (s: StoryDTO) => s._id === mapState.selectedStoryId
        );
    }, [mapState.selectedStoryId, parsedStories]);
    if (!story) return null;

    // mobile view
    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpenAction}>
                <DrawerContent>
                    <div className={"px-6 pb-6 overflow-y-auto flex-1"}>
                        <StoryDetailsHeader
                            story={story}
                            className={"bg-background"}
                        />
                        <div className="prose dark:prose-invert px-0">
                            {parse(story.content)}
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    // desktop view
    if (!open) return null;
    return (
        <Card
            className={
                "gap-3 max-w-[40svh] max-h-full lg:w-md xl:w-xl pointer-events-auto overflow-y-auto rounded-md border-0 p-0 overscroll-none"
            }
        >
            <Link
                href={"/" + story.experience + "/stories/view/" + story._id}
                className={
                    "w-full hover:brightness-75 transition-all duration-200 hover:cursor-pointer"
                }
            >
                <S3Image
                    link={false}
                    experience={story.experience}
                    fileName={story.featured_image_url}
                />
            </Link>
            <div className={"px-6 pb-6 flex flex-col"}>
                <StoryDetailsHeader story={story} className={"bg-card"} />
                <Separator className={"mb-6"} />
                <div className="prose dark:prose-invert prose-headings:mb-2">
                    {parse(story.content)}
                </div>
            </div>
        </Card>
    );
}
