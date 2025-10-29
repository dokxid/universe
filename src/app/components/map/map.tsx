"use client";

import { DeckGLMap } from "@/app/components/map/deck-gl-map";
import { LabDTO, StoryDTO, TagDTO } from "@/types/dtos";
import "maplibre-gl/dist/maplibre-gl.css";
import { use } from "react";
import { MapProvider } from "react-map-gl/maplibre";

export default function MapWrapper({
    tagsPromise,
    stories,
    experiences,
    experienceSlug,
}: {
    tagsPromise: Promise<TagDTO[]>;
    stories: StoryDTO[];
    experiences: LabDTO[];
    experienceSlug: string;
}) {
    const tags = use(tagsPromise);

    return (
        <MapProvider>
            <DeckGLMap
                tags={tags}
                stories={stories}
                experiences={experiences}
                experienceSlug={experienceSlug}
            ></DeckGLMap>
        </MapProvider>
    );
}
