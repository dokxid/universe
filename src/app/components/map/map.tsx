"use client";

import { DeckGLMap } from "@/app/components/map/deck-gl-map";
import { useTags } from "@/lib/swr/tag-hook";
import { LabDTO, StoryPinDTO } from "@/types/dtos";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapProvider } from "react-map-gl/maplibre";

export default function MapWrapper({
    stories,
    labs,
    labSlug,
}: {
    stories: StoryPinDTO[];
    labs: LabDTO[];
    labSlug: string;
}) {
    const { tags, isLoading, isError } = useTags();
    if (isLoading) {
        return <div>Loading map...</div>;
    }
    if (isError || !tags) {
        return <div>Error loading map tags.</div>;
    }

    return (
        <MapProvider>
            <DeckGLMap
                tags={tags}
                stories={stories}
                labs={labs}
                labSlug={labSlug}
            ></DeckGLMap>
        </MapProvider>
    );
}
