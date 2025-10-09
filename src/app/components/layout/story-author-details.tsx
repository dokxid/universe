"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { StoryDTO } from "@/types/dtos";
import Link from "next/link";

export function StoryAuthorDetails({
    story,
    className,
    profilePictureVisible = true,
}: {
    story: StoryDTO;
    className?: string;
    profilePictureVisible?: boolean;
}) {
    return (
        <div
            className={cn(
                "flex flex-row items-center mb-1 justify-between sticky py-4 top-0 transition-all duration-200",
                className
            )}
        >
            <div className={"flex flex-row items-center gap-3"}>
                {profilePictureVisible && (
                    <Link
                        className={
                            "cursor-pointer hover:brightness-80 transition-all duration-100"
                        }
                        href={`/${story.experience}/user/view/${story.authorId}`}
                    >
                        <Avatar className={"size-9"}>
                            <AvatarImage
                                src={story.authorProfilePictureUrl || ""}
                            />
                            <AvatarFallback>
                                {story.author_name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                )}
                <article
                    className={"flex flex-col text-left h-9 justify-between"}
                >
                    <p className={"text-sm text-muted-foreground"}>
                        {"by "}
                        <Link
                            className={"hover:underline cursor-pointer"}
                            href={`/${story.experience}/user/view/${story.authorId}`}
                        >
                            <b>{`${story.author_name}`}</b>
                        </Link>
                    </p>
                    <p className={"text-xs text-muted-foreground"}>
                        {`created on: ${new Date(
                            story.createdAt
                        ).toLocaleDateString()}`}
                    </p>
                </article>
            </div>
        </div>
    );
}

export function StoryAuthorHeaderMapView({
    story,
    className,
    profilePictureVisible = true,
    lines = 2,
}: {
    slug?: string;
    story: StoryDTO;
    className?: string;
    profilePictureVisible?: boolean;
    lines?: number;
}) {
    return (
        <div
            className={cn(
                "flex flex-row items-center mb-1 justify-between sticky py-4 top-0 transition-all duration-200",
                className
            )}
        >
            <div className={"flex flex-row items-center gap-3"}>
                {profilePictureVisible && (
                    <Link
                        className={
                            "cursor-pointer hover:brightness-80 transition-all duration-100"
                        }
                        href={`/${story.experience}/user/view/${story.authorId}`}
                    >
                        <Avatar>
                            <AvatarImage
                                src={story.authorProfilePictureUrl || ""}
                            />
                            <AvatarFallback>
                                {story.author_name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                )}
                <article className={"flex flex-col text-left gap-1"}>
                    <Link
                        href={
                            "/" +
                            story.experience +
                            "/stories/view/" +
                            story._id
                        }
                    >
                        <h3
                            className={`font-semibold line-clamp-${lines} leading-none overflow-hidden link-external`}
                        >
                            {story.title}
                        </h3>
                    </Link>
                    <p className={"text-sm text-muted-foreground"}>
                        {"by "}
                        <Link
                            className={
                                "hover:underline cursor-pointer link-external"
                            }
                            href={`/${story.experience}/user/view/${story.authorId}`}
                        >
                            {story.author_name}
                        </Link>
                    </p>
                </article>
            </div>
        </div>
    );
}
