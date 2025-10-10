"use client";

import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/lib/hooks";
import { resetView } from "@/lib/redux/map/map-slice";

export default function ResetViewButton() {
    const dispatch = useAppDispatch();
    return (
        <Button
            onClick={() => dispatch(resetView())}
            variant={"secondary_custom"}
            size={"icon-lg"}
            className={"font-semibold"}
        >
            N↑
        </Button>
    );
}
