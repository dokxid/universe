"use client";

import { SettingsFormButtonGroup } from "@/app/components/layout/content-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { StoryDTO } from "@/types/dtos";
import { editStoryFormSchema } from "@/types/form-schemas";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";
import z from "zod";

export function StoryAuthorDetails({
    story,
    className,
    profilePictureVisible = true,
    sticky = true,
}: {
    story: StoryDTO;
    className?: string;
    profilePictureVisible?: boolean;
    sticky?: boolean;
}) {
    return (
        <div
            className={cn(
                `flex flex-row items-center mb-1 justify-between ${
                    sticky ? "sticky" : ""
                } py-4 top-0 transition-all duration-200`,
                className
            )}
        >
            <div className={"flex flex-row items-center gap-3"}>
                {profilePictureVisible && (
                    <Link
                        className={
                            "cursor-pointer hover:brightness-80 transition-all duration-100"
                        }
                        href={`/${story.experience}/user/view/${story.author}`}
                    >
                        <Avatar className={"size-[52px]"}>
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
                    className={"flex flex-col text-left h-fit justify-between"}
                >
                    <p className={"text-sm text-muted-foreground"}>
                        {"by "}
                        <Link
                            className={"hover:underline cursor-pointer"}
                            href={`/${story.experience}/user/view/${story.author}`}
                        >
                            <b>{`${story.author_name}`}</b>
                        </Link>
                    </p>
                    <p className={"text-xs text-muted-foreground"}>
                        {`created on: ${new Date(
                            story.createdAt
                        ).toLocaleDateString()}`}
                    </p>
                    <p className={"text-xs text-muted-foreground"}>
                        {`year: ${story.year}`}
                    </p>
                </article>
            </div>
        </div>
    );
}

export function StoryAuthorEditDetails({
    form,
    story,
    className,
    profilePictureVisible = true,
    sticky = true,
}: {
    form: UseFormReturn<z.infer<typeof editStoryFormSchema>>;
    story: StoryDTO;
    className?: string;
    profilePictureVisible?: boolean;
    sticky?: boolean;
}) {
    return (
        <div
            className={cn(
                `flex flex-row items-center mb-1 justify-between ${
                    sticky ? "sticky" : ""
                } py-4 top-0 transition-all duration-200`,
                className
            )}
        >
            <div className={"flex flex-row items-center gap-3 w-full"}>
                {profilePictureVisible && (
                    <Link
                        className={
                            "cursor-pointer hover:brightness-80 transition-all duration-100"
                        }
                        href={`/${story.experience}/user/view/${story.author}`}
                    >
                        <Avatar className={"size-[52px]"}>
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
                    className={
                        "flex flex-col text-left h-fit justify-between grow"
                    }
                >
                    <p className={"text-sm text-muted-foreground"}>
                        {"by "}
                        <Link
                            className={"hover:underline cursor-pointer"}
                            href={`/${story.experience}/user/view/${story.author}`}
                        >
                            <b>{`${story.author_name}`}</b>
                        </Link>
                    </p>
                    <p className={"text-xs text-muted-foreground"}>
                        {`created on: ${new Date(
                            story.createdAt
                        ).toLocaleDateString()}`}
                    </p>
                    <div className={"flex flex-row gap-0.5"}>
                        <p className={"text-xs text-muted-foreground"}>
                            {`year: `}
                        </p>
                        <div className={"bg-accent flex flex-row items-center"}>
                            <FormField
                                name="year"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <input
                                                className={
                                                    "text-xs border-[1px] border-black text-muted-foreground w-12 px-2"
                                                }
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            ></FormField>
                        </div>
                    </div>
                </article>
                <SettingsFormButtonGroup>
                    <Button
                        type={"reset"}
                        variant={"ghost"}
                        className={"w-fit"}
                    >
                        Reset
                    </Button>
                    <Button
                        type={"submit"}
                        variant={"default"}
                        className={"w-fit"}
                    >
                        Apply
                    </Button>
                </SettingsFormButtonGroup>
            </div>
        </div>
    );
}

export function StoryAuthorHeaderMapView({
    story,
    className,
    profilePictureVisible = true,
    lines = 2,
    forceWhiteText = false,
}: {
    slug?: string;
    story: StoryDTO;
    className?: string;
    profilePictureVisible?: boolean;
    lines?: number;
    forceWhiteText?: boolean;
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
                        href={`/${story.experience}/user/view/${story.author}`}
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
                            className={`font-semibold line-clamp-${lines} leading-none overflow-hidden ${
                                forceWhiteText ? "" : "link-external"
                            }`}
                        >
                            {story.title}
                        </h3>
                    </Link>
                    <p className={"text-sm text-muted-foreground"}>
                        {"by "}
                        <Link
                            className={`hover:underline cursor-pointer ${
                                forceWhiteText
                                    ? "arrow-external"
                                    : "link-external"
                            }`}
                            href={`/${story.experience}/user/view/${story.author}`}
                        >
                            {story.author_name}
                        </Link>
                    </p>
                </article>
            </div>
        </div>
    );
}
