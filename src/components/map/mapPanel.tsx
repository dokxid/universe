"use client";

import { setCurrentExperience } from "@/lib/features/experiences/experiencesSlice";
import { setFlyPosition, setZoomLevel } from "@/lib/features/map/mapSlice";
import { useAppDispatch } from "@/lib/hooks";
import dynamic from "next/dynamic";
import { Suspense, use } from "react";
import { ExperienceData } from "@/types/api";

// make dynamic loading
const MyMap = dynamic(() => import("@/components/map/map"), {
    ssr: false,
});

export function MapPanel({
    storiesPromise,
    experiencePromise,
    labSlug,
}: {
    storiesPromise: Promise<string>;
    experiencePromise: Promise<string>;
    labSlug: string;
}) {
    const dispatch = useAppDispatch();
    const experience = use(experiencePromise);
    const data = JSON.parse(experience) as ExperienceData;

    // initialize experience unconditionally
    dispatch(setCurrentExperience(labSlug));

    // fly to experience center after fetching
    dispatch(setFlyPosition(data.center.coordinates));
    dispatch(setZoomLevel(data.initial_zoom));

    return (
        <Suspense fallback={<div>loading stories...</div>}>
            <MyMap storiesPromise={storiesPromise}></MyMap>
        </Suspense>
    );
}
