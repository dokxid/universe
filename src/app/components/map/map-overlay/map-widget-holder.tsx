"use client";

import ResetViewButton from "@/app/components/map/map-overlay/reset-view-button";
import ToggleGlobeButton from "@/app/components/map/map-overlay/toggle-globe-button";
import { Button } from "@/components/ui/button";
import { SettingsIcon } from "lucide-react";
import Link from "next/link";

export function MapWidgetHolder({ slug }: { slug: string }) {
    return (
        <div className={"flex flex-row gap-2 pointer-events-auto w-fit"}>
            <Link href={`/${slug}/map-settings`}>
                <Button
                    variant={"secondary_custom"}
                    className={"size-10"}
                    id={"map-settings-button"}
                >
                    <SettingsIcon />
                </Button>
            </Link>
            <ToggleGlobeButton />
            <ResetViewButton />
        </div>
    );
}
