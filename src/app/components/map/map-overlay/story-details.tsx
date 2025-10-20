"use client";

import { TagList } from "@/app/components/cards/tag-list";
import { HostedImage } from "@/app/components/embeds/s3-image";
import { StoryAuthorHeaderMapView } from "@/app/components/layout/story-author-details";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { setSelectedStoryIdParams } from "@/lib/utils/param-setter";
import { StoryDTO } from "@/types/dtos";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import parse from "html-react-parser";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";

export function StoryDetails({
    slug,
    storiesPromise,
}: {
    slug: string;
    storiesPromise: Promise<StoryDTO[]>;
}) {
    const pathname = usePathname();
    const isMobile = useIsMobile();
    const searchParams = useSearchParams();
    const navigationState = useAppSelector((state) => state.navigation);
    const [drawerOpen, setDrawerOpen] = useState(
        navigationState.storyDetailsOpen
    );
    const cardRef = useRef<HTMLDivElement>(null);
    const [activeStory, setActiveStory] = useState<StoryDTO | null>(null);
    const stories = use(storiesPromise);

    useEffect(() => {
        if (searchParams.get("story") === "") {
            setActiveStory(null);
        } else {
            setActiveStory(
                stories.find(
                    (story) => story._id === searchParams.get("story")
                ) || null
            );
        }
    }, [searchParams, stories]);

    useEffect(() => {
        cardRef.current?.scrollTo(0, 0);
    }, [activeStory]);

    useEffect(() => {
        if (activeStory) setDrawerOpen(true);
    }, [activeStory]);

    if (!activeStory) return null;

    const handleMobileDrawerChange = (drawerOpenState: boolean) => {
        setDrawerOpen(drawerOpenState);
    };

    // mobile view
    if (isMobile) {
        return (
            <Drawer open={drawerOpen} onOpenChange={handleMobileDrawerChange}>
                <DrawerContent className={"border-t-0"}>
                    <VisuallyHidden>
                        <DrawerTitle>{activeStory.title}</DrawerTitle>
                    </VisuallyHidden>
                    <div
                        className={
                            "px-6 pb-6 overflow-y-auto flex-1 flex flex-col gap-2"
                        }
                    >
                        <StoryAuthorHeaderMapView
                            slug={slug}
                            story={activeStory}
                            className={"bg-background z-1"}
                        />
                        <Link
                            href={
                                "/" +
                                activeStory.experience +
                                "/stories/view/" +
                                activeStory._id
                            }
                            className={
                                "w-full hover:brightness-75 shrink-0 transition-all duration-200 hover:cursor-pointer overflow-hidden"
                            }
                        >
                            <HostedImage
                                className={
                                    "hover:scale-105 transition-all duration-200"
                                }
                                fileName={activeStory.featuredImageUrl}
                            />
                        </Link>
                        <Separator className={"my-4"} />
                        <div
                            className={
                                "flex flex-row flex-wrap gap-x-1 gap-y-2 mb-3"
                            }
                        >
                            <TagList tags={activeStory.tags} variant={"add"} />
                        </div>
                        <div className="prose dark:prose-invert prose-headings:mb-2 prose-headings:mt-4 px-0 mb-10">
                            {parse(activeStory.content)}
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    // desktop view
    return (
        <Card
            ref={cardRef}
            className={`relative gap-3 max-w-[40svh] max-h-full lg:w-md xl:w-xl pointer-events-auto overflow-y-auto rounded-md border-0 p-0 overscroll-none scroll ${
                navigationState.storyDetailsOpen ? "" : "hidden"
            }`}
        >
            <div
                className={cn(
                    "z-10 *:stroke-background-foreground cursor-pointer",
                    slug === "universe"
                        ? "absolute top-4 right-4"
                        : "fixed top-8 right-8"
                )}
            >
                <Button
                    variant={"secondary"}
                    className={"p-0 size-8 rounded-full"}
                    onClick={() => {
                        setSelectedStoryIdParams(pathname, searchParams, "");
                    }}
                >
                    <VisuallyHidden>Close story details</VisuallyHidden>
                    <X className={"size-4"} />
                </Button>
            </div>
            <Link
                href={
                    "/" +
                    activeStory.experience +
                    "/stories/view/" +
                    activeStory._id
                }
                className={
                    "w-full hover:brightness-75 shrink-0 transition-all duration-200 hover:cursor-pointer overflow-hidden relative"
                }
            >
                <HostedImage
                    className={"hover:scale-105 transition-all duration-200"}
                    fileName={activeStory.featuredImageUrl}
                />
            </Link>
            <div className={"px-6 pb-6 flex flex-col"}>
                <StoryAuthorHeaderMapView
                    story={activeStory}
                    className={"bg-card"}
                />
                <Separator className={"mb-6"} />
                <TagList tags={activeStory.tags} variant={"add"} />
                <div className="prose dark:prose-invert prose-sm prose-headings:mb-2 mt-3">
                    {parse(activeStory.content)}
                </div>
            </div>
        </Card>
    );
}
