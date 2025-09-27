"use client";

import { Button } from "@/components/ui/button";
import { decrementZoomLevel, setFlyBack } from "@/lib/features/map/mapSlice";
import { useAppDispatch } from "@/lib/hooks";
import { ArrowLeftToLine } from "lucide-react";
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
    console.log("Rendering FlyBackButton with isVisible:", isVisible);

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
            <ArrowLeftToLine className={"size-4"} />
            <p className={"text-xs hidden lg:inline-block"}>
                {isUniverseView
                    ? "Back to universe view"
                    : "Back to lab center"}
            </p>
        </Button>
    );
}
