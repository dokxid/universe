"use client";

import { useAppDispatch } from "@/lib/hooks";
import { setCurrentExperience } from "@/lib/redux/experiences/experiences-slice";
import { LabDTO, StoryDTO, TagDTO } from "@/types/dtos";
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
    tagsPromise: Promise<TagDTO[]>;
    storiesPromise: Promise<StoryDTO[]>;
    experiencesPromise: Promise<LabDTO[]>;
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
