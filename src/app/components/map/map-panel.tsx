"use client";

import { useAppDispatch } from "@/lib/hooks";
import { setCurrentLab } from "@/lib/redux/lab/lab-slice";
import { LabDTO, StoryPinDTO } from "@/types/dtos";
import dynamic from "next/dynamic";
import { use, useEffect } from "react";

// make dynamic loading
const MapWrapper = dynamic(() => import("@/app/components/map/map"), {
    ssr: false,
});

export function MapPanel({
    storiesPromise,
    labPromise,
    labSlug,
}: {
    storiesPromise: Promise<StoryPinDTO[]>;
    labPromise: Promise<LabDTO[]>;
    labSlug: string;
}) {
    const labs = use(labPromise);
    const stories = use(storiesPromise);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setCurrentLab(labSlug));
    }, [dispatch, labSlug]);

    return (
        <MapWrapper
            stories={stories}
            labs={labs}
            labSlug={labSlug}
        />
    );
}
