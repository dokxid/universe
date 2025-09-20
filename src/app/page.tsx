"use server";

import { MapOverlay } from "@/app/components/map/mapOverlay";
import { MapPanel } from "@/app/components/map/mapPanel";
import { AppSidebar } from "@/app/components/sidebar/appSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
        <div className="w-full h-full flex">
            <AppSidebar labSlug={experienceSlug} />
            <div className="grow">
                <div className="w-full h-full relative">
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
                            <MapOverlay>
                                <SidebarTrigger className="pointer-events-auto size-10 bg-primary text-primary-foreground" />
                            </MapOverlay>
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}
