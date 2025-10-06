"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function StoryViewDetails({
    author,
    slug,
    createdAt,
    className,
    profilePictureVisible = true,
}: {
    author: string;
    slug: string;
    createdAt: Date;
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
                    <Avatar className={"size-9"}>
                        <AvatarFallback>{author.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
                <article
                    className={"flex flex-col text-left h-9 justify-between"}
                >
                    <p className={"text-sm text-muted-foreground"}>
                        {"by "}
                        <Link
                            className={"hover:underline cursor-pointer"}
                            href={`/${slug}/user/${author}`}
                        >
                            <b>{`${author}`}</b>
                        </Link>
                    </p>
                    <p className={"text-xs text-muted-foreground"}>
                        {`created on: ${new Date(
                            createdAt
                        ).toLocaleDateString()}`}
                    </p>
                </article>
            </div>
        </div>
    );
}
