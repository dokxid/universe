"use server";

import { MapOverlay } from "@/app/components/map/map-overlay";
import { MapPanel } from "@/app/components/map/map-panel";
import { AppSidebar } from "@/app/components/sidebar/app-sidebar";
import { getExperienceDTO, getPublicStoriesDTO } from "@/data/dto/story-dto";
import { Suspense } from "react";

export default async function Home({
    params,
}: {
    params: { labSlug?: Promise<string> };
}) {
    const experienceSlug = (await params.labSlug) ?? "universe";
    const storiesPromise = getPublicStoriesDTO();
    const experiencePromise = getExperienceDTO(experienceSlug);

    const [storiesSerialized, experienceSerialized] = await Promise.all([
        storiesPromise,
        experiencePromise,
    ]);

    return (
        <div className="w-screen h-screen flex">
            <AppSidebar labSlug={experienceSlug} />
            <div className="flex grow">
                <div className="grow relative">
                    {/* map */}
                    <div className="absolute z-20 w-full h-full">
                        <Suspense fallback={<div>Loading...</div>}>
                            <MapPanel
                                labSlug={experienceSlug}
                                experienceSerialized={experienceSerialized}
                                storiesSerialized={storiesSerialized}
                            />
                        </Suspense>
                    </div>

                    {/* overlay */}
                    <div className="absolute z-30 w-full h-full pointer-events-none">
                        <Suspense fallback={<div>Loading...</div>}>
                            <MapOverlay></MapOverlay>
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}
