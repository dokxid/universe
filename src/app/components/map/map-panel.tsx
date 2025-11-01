"use client";

import { useAppDispatch } from "@/lib/hooks";
import { setCurrentExperience } from "@/lib/redux/experiences/experiences-slice";
import { LabDTO, StoryPinDTO, TagDTO } from "@/types/dtos";
import dynamic from "next/dynamic";
import { use, useEffect } from "react";

// make dynamic loading
const MapWrapper = dynamic(() => import("@/app/components/map/map"), {
    ssr: false,
});

export function MapPanel({
    tagsPromise,
    storiesPromise,
    labPromise,
    labSlug,
}: {
    tagsPromise: Promise<TagDTO[]>;
    storiesPromise: Promise<StoryPinDTO[]>;
    labPromise: Promise<LabDTO[]>;
    labSlug: string;
}) {
    const labs = use(labPromise);
    const stories = use(storiesPromise);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setCurrentExperience(labSlug));
    }, [dispatch, labSlug]);

    return (
        <MapWrapper
            tagsPromise={tagsPromise}
            stories={stories}
            labs={labs}
            labSlug={labSlug}
        />
    );
}
