"use client";

import { setCurrentExperience } from "@/lib/features/experiences/experiencesSlice";
import { useAppDispatch } from "@/lib/hooks";
import { Experience, StoryDTO, UnescoTagDTO } from "@/types/api";
import dynamic from "next/dynamic";
import { use, useEffect } from "react";

// make dynamic loading
const MapWrapper = dynamic(() => import("@/app/components/map/map"), {
    ssr: false,
});

export function MapPanel({
    tagsPromise,
    storiesPromise,
    experiencesPromise,
    experienceSlug,
}: {
    tagsPromise: Promise<UnescoTagDTO[]>;
    storiesPromise: Promise<StoryDTO[]>;
    experiencesPromise: Promise<Experience[]>;
    experienceSlug: string;
}) {
    const experiences = use(experiencesPromise);
    const stories = use(storiesPromise);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setCurrentExperience(experienceSlug));
    }, [dispatch, experienceSlug]);

    return (
        <MapWrapper
            tagsPromise={tagsPromise}
            stories={stories}
            experiences={experiences}
            experienceSlug={experienceSlug}
        />
    );
}
