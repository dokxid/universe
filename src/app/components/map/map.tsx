"use client";

import { DeckGLMap } from "@/app/components/map/deck-gl-map";
import { Experience, StoryDTO } from "@/types/api";
import { MapProvider } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MapWrapper({
    stories,
    experiences,
    experienceSlug,
}: {
    stories: StoryDTO[];
    experiences: Experience[];
    experienceSlug: string;
}) {
    return (
        <MapProvider>
            <DeckGLMap
                stories={stories}
                experiences={experiences}
                experienceSlug={experienceSlug}
            ></DeckGLMap>
        </MapProvider>
    );
}
