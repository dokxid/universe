"use client";

import { DeckGLMap } from "@/app/components/map/deck-gl-map";
import { Experience, StoryDTO, UnescoTagDTO } from "@/types/dtos";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import "maplibre-gl/dist/maplibre-gl.css";
import { use } from "react";
import { MapProvider } from "react-map-gl/maplibre";

export default function MapWrapper({
    tagsPromise,
    stories,
    experiences,
    experienceSlug,
}: {
    tagsPromise: Promise<UnescoTagDTO[]>;
    stories: StoryDTO[];
    experiences: Experience[];
    experienceSlug: string;
}) {
    const tags = use(tagsPromise);
    const { user, loading, roles, organizationId } = useAuth();
    if (loading) return <div>Loading...</div>;
    console.log("User:", user);
    console.log("Roles:", roles);
    console.log("Organization ID:", organizationId);

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
