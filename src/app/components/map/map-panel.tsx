"use client";

import { setCurrentExperience } from "@/lib/features/experiences/experiencesSlice";
import { useAppDispatch } from "@/lib/hooks";
import { Experience, Story } from "@/types/api";
import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";

// make dynamic loading
const MyMap = dynamic(() => import("@/app/components/map/map"), {
    ssr: false,
});

export function MapPanel({
    storiesSerialized,
    experiencesSerialized,
    experienceSlug,
}: {
    storiesSerialized: string; // JSON stringified StoryData[]
    experiencesSerialized: string; // JSON stringified ExperienceData[]
    experienceSlug: string;
}) {
    const stories = JSON.parse(storiesSerialized) as Story[];
    const experiences = JSON.parse(experiencesSerialized) as Experience[];
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setCurrentExperience(experienceSlug));
    }, [dispatch, experienceSlug]);

    return (
        <>
            <Suspense fallback={<div>loading stories...</div>}>
                <MyMap
                    stories={stories}
                    experiences={experiences}
                    experienceSlug={experienceSlug}
                ></MyMap>
            </Suspense>
        </>
    );
}
