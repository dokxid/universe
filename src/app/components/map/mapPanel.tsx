"use client";

import {setCurrentExperience} from "@/lib/features/experiences/experiencesSlice";
import {useAppDispatch} from "@/lib/hooks";
import dynamic from "next/dynamic";
import {Suspense} from "react";
import {ExperienceData, StoryData} from "@/types/api";

// make dynamic loading
const MyMap = dynamic(() => import("@/app/components/map/map"), {
    ssr: false,
});

export function MapPanel({
                             storiesSerialized,
                             experienceSerialized,
                             labSlug,
                         }: {
    storiesSerialized: string; // JSON stringified StoryData[]
    experienceSerialized: string; // JSON stringified ExperienceData
    labSlug: string;
}) {
    const stories = JSON.parse(storiesSerialized) as StoryData[];
    const experience = JSON.parse(experienceSerialized) as ExperienceData;

    const dispatch = useAppDispatch();
    // initialize experience unconditionally
    dispatch(setCurrentExperience(labSlug));

    return (
        <Suspense fallback={<div>loading stories...</div>}>
            <MyMap
                stories={stories}
                experience={experience}
                labSlug={labSlug}
            ></MyMap>
        </Suspense>
    );
}
