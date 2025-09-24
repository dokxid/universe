"use client";

import { DeckGLMap } from "@/app/components/map/deck-gl-map";
import { Experience, StoryDTO } from "@/types/api";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MapProvider({
    stories,
    experiences,
    experienceSlug,
}: {
    stories: StoryDTO[];
    experiences: Experience[];
    experienceSlug: string;
}) {
    return (
        <DeckGLMap
            stories={stories}
            experiences={experiences}
            experienceSlug={experienceSlug}
        ></DeckGLMap>
    );
}
