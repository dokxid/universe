"use client";

import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/lib/hooks";
import { triggerZoomOut } from "@/lib/redux/map/map-slice";
import { Navigation2 } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

export function FlyBackButton() {
    const pathname = usePathname();
    const slug = pathname.split("/")[1];
    const isUniverseView = slug === "universe";
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    const isVisible = searchParams.get("exp") !== null;

    return !isVisible ? null : (
        <Button
            onClick={() => {
                dispatch(triggerZoomOut());
                if (isUniverseView) {
                    history.pushState(null, "", "/universe/map");
                }
            }}
            variant={"secondary"}
            className={"flex flex-row gap-2 items-center h-10 hover:ring-2"}
        >
            <Navigation2 size={4} />
            <p className={"text-xs hidden lg:inline-block"}>
                {isUniverseView ? "Leave Lab" : "Recentre to Lab"}
            </p>
        </Button>
    );
}
