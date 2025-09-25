"use client";

import S3Image from "@/app/components/s3-image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useAppSelector } from "@/lib/hooks";
import { StoryDTO } from "@/types/api";
import parse from "html-react-parser";
import Link from "next/link";
import { useMemo } from "react";

export function StoryDetails({ stories }: { stories: string }) {
    const mapState = useAppSelector((state) => state.map);
    const parsedStories = JSON.parse(stories);
    const story: StoryDTO = useMemo(() => {
        if (mapState.selectedStoryId === "") return undefined;
        return parsedStories.find(
            (s: StoryDTO) => s._id === mapState.selectedStoryId
        );
    }, [mapState.selectedStoryId, parsedStories]);
    if (!story) return null;
    return (
        <Card
            className={"max-h-[50svh] w-80 pointer-events-auto overflow-y-auto"}
        >
            <CardHeader>
                <Link href={"/" + story.experience + "/stories/" + story._id}>
                    <div className={"flex flex-row items-center gap-2 mb-2"}>
                        <Avatar>
                            <AvatarFallback>
                                {story.author_name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <article className={"flex flex-col"}>
                            <CardTitle>{story.title}</CardTitle>
                            <CardDescription>
                                by {story.author_name}
                            </CardDescription>
                        </article>
                    </div>
                </Link>
                <div className={"w-full"}>
                    <S3Image
                        experience={story.experience}
                        fileName={story.featured_image_url}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="prose-content">{parse(story.content)}</div>
            </CardContent>
        </Card>
    );
}
