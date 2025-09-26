"use client";

import { Button } from "@/components/ui/button";
import { decrementZoomLevel } from "@/lib/features/map/mapSlice";
import { useAppDispatch } from "@/lib/hooks";
import { createQueryString } from "@/lib/utils/url";
import { ArrowLeftToLine } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function BackToUniverseButton({ visible }: { visible: boolean }) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleCreateQueryString = useCallback(
        (name: string, value: string) =>
            createQueryString(searchParams, name, value),
        [searchParams]
    );

    return !visible ? null : (
        <Button
            onClick={() => {
                router.push(
                    pathname + "?" + handleCreateQueryString("exp", "universe")
                );
                dispatch(decrementZoomLevel());
            }}
            variant={"secondary"}
            className={"flex flex-row gap-2 items-center h-10 hover:ring-2"}
        >
            <ArrowLeftToLine className={"size-4"} />
            <p className={"text-xs hidden lg:inline-block"}>
                Back to universe view
            </p>
        </Button>
    );
}
