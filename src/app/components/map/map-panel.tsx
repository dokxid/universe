"use client";

import { setCurrentExperience } from "@/lib/features/experiences/experiencesSlice";
import { useAppDispatch } from "@/lib/hooks";
import { Experience, StoryDTO, UnescoTagDTO } from "@/types/api";
import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";

// make dynamic loading
const MapWrapper = dynamic(() => import("@/app/components/map/map"), {
    ssr: false,
});

export function MapPanel({
    tagsPromise,
    storiesSerialized,
    experiencesSerialized,
    experienceSlug,
}: {
    tagsPromise: Promise<UnescoTagDTO[]>;
    storiesSerialized: string;
    experiencesSerialized: string;
    experienceSlug: string;
}) {
    const stories = JSON.parse(storiesSerialized) as StoryDTO[];
    const experiences = JSON.parse(experiencesSerialized) as Experience[];
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setCurrentExperience(experienceSlug));
    }, [dispatch, experienceSlug]);

    return (
        <>
            <Suspense fallback={<div>loading stories...</div>}>
                <MapWrapper
                    tagsPromise={tagsPromise}
                    stories={stories}
                    experiences={experiences}
                    experienceSlug={experienceSlug}
                />
            </Suspense>
        </>
    );
}
