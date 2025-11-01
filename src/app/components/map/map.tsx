"use client";

import { DeckGLMap } from "@/app/components/map/deck-gl-map";
import { LabDTO, StoryPinDTO, TagDTO } from "@/types/dtos";
import "maplibre-gl/dist/maplibre-gl.css";
import { use } from "react";
import { MapProvider } from "react-map-gl/maplibre";

export default function MapWrapper({
    tagsPromise,
    stories,
    labs,
    labSlug,
}: {
    tagsPromise: Promise<TagDTO[]>;
    stories: StoryPinDTO[];
    labs: LabDTO[];
    labSlug: string;
}) {
    const tags = use(tagsPromise);

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
