"use client";

import { SettingsFormButtonGroup } from "@/app/components/layout/content-layout";
import { Button } from "@/components/ui/button";
import { useAllowedToEditStory } from "@/lib/swr/user-hook";
import { StoryDTO } from "@/types/dtos";
import Link from "next/link";

export function EditStoryButtons({ story }: { story: StoryDTO }) {
    const { allowedToEditStory, isLoading, isError } = useAllowedToEditStory(
        story.lab.slug,
        story.id
    );
    if (isLoading) return <Button>Loading...</Button>;
    if (isError) return <Button>Error</Button>;
    return (
        <>
            <SettingsFormButtonGroup className={"h-full self-start"}>
                {allowedToEditStory && (
                    <Link href={`/${story.lab.slug}/stories/edit/${story.id}`}>
                        <Button variant={"secondary_custom"}>Edit</Button>
                    </Link>
                )}
                <Link href={`/${story.lab.slug}/map?story=${story.id}`}>
                    <Button variant={"primary_custom"}>View on map</Button>
                </Link>
            </SettingsFormButtonGroup>
        </>
    );
}
