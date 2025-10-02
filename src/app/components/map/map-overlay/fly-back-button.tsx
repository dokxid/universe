"use client";

import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/lib/hooks";
import { decrementZoomLevel, setFlyBack } from "@/lib/redux/map/mapSlice";
import { Navigation2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function FlyBackButton({
    isUniverseView,
    isVisible,
}: {
    isUniverseView: boolean;
    isVisible: boolean;
}) {
    const dispatch = useAppDispatch();
    const router = useRouter();

    return !isVisible ? null : (
        <Button
            onClick={() => {
                dispatch(decrementZoomLevel());
                dispatch(setFlyBack());
                if (isUniverseView) {
                    router.push("/universe/map");
                }
            }}
            variant={"secondary"}
            className={"flex flex-row gap-2 items-center h-10 hover:ring-2"}
        >
            <Navigation2 size={4} />
            <p className={"text-xs hidden lg:inline-block"}>
                {isUniverseView ? "Leave lab" : "Recentre"}
            </p>
        </Button>
    );
}
