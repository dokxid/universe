"use client";

import S3Image from "@/app/components/s3-image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppSelector } from "@/lib/hooks";
import { StoryDTO } from "@/types/api";
import parse from "html-react-parser";
import Link from "next/link";
import { useMemo } from "react";

function StoryDetailsHeader({ author_name, title, experience, _id }: StoryDTO) {
    return (
        <div
            className={
                "flex flex-row items-center mb-2 justify-between sticky py-3 top-0 bg-card"
            }
        >
            <div className={"flex flex-row items-center gap-3"}>
                <Avatar>
                    <AvatarFallback>{author_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <article className={"flex flex-col text-left"}>
                    <p className={"font-semibold"}>{title}</p>
                    <p className={"text-sm text-muted-foreground"}>
                        by {author_name}
                    </p>
                </article>
            </div>
            <Link href={"/" + experience + "/stories/" + _id}>
                <Button variant={"link"} className={"p-0"}>
                    Read more
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
    stories: string;
    open: boolean;
    setOpenAction: (open: boolean) => void;
}) {
    const isMobile = useIsMobile();
    const mapState = useAppSelector((state) => state.map);
    const parsedStories = JSON.parse(stories);
    const story: StoryDTO = useMemo(() => {
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
                    <div className={"p-1 overflow-y-auto flex-1"}>
                        <DrawerHeader className={"gap-4"}>
                            <StoryDetailsHeader {...story} />
                        </DrawerHeader>
                        <Separator />
                        <div className="prose dark:prose-invert px-4">
                            {parse(story.content)}
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    // desktop view
    return (
        <Card
            className={
                "gap-3 max-h-[50svh] lg:w-md xl:w-xl pointer-events-auto overflow-y-auto rounded-md border-0 p-0"
            }
        >
            <div className={"w-full"}>
                <S3Image
                    experience={story.experience}
                    fileName={story.featured_image_url}
                />
            </div>
            <div className={"px-6 pb-6 flex flex-col"}>
                <StoryDetailsHeader {...story} />
                <div className="prose dark:prose-invert prose-headings:mb-2">
                    {parse(story.content)}
                </div>
            </div>
        </Card>
    );
}
