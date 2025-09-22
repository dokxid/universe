"use server";

import { MapOverlay } from "@/app/components/map/map-overlay";
import { MapPanel } from "@/app/components/map/map-panel";
import { AppSidebar } from "@/app/components/sidebar/app-sidebar";
import { getExperiencesDTO } from "@/data/dto/experience-dto";
import { getPublicStoriesDTO } from "@/data/dto/story-dto";
import { Suspense } from "react";

export default async function MapView({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const { slug } = await params;
    const experienceSearchParam = (await searchParams).exp;
    const experienceSlug = slug ?? "universe";
    const storiesPromise = getPublicStoriesDTO();
    const experiencesPromise = getExperiencesDTO();

    const [storiesSerialized, experiencesSerialized] = await Promise.all([
        storiesPromise,
        experiencesPromise,
    ]);

    return (
        <div className="w-screen h-screen flex">
            <AppSidebar slug={experienceSlug} />
            <div className="flex grow">
                <div className="grow relative">
                    {/* map */}
                    <div className="absolute z-20 w-full h-full">
                        <Suspense fallback={<div>Loading...</div>}>
                            <MapPanel
                                experienceSlug={experienceSlug}
                                experiencesSerialized={experiencesSerialized}
                                storiesSerialized={storiesSerialized}
                            />
                        </Suspense>
                    </div>

                    {/* overlay */}
                    <div className="absolute z-30 w-full h-full pointer-events-none">
                        <Suspense fallback={<div>Loading...</div>}>
                            <MapOverlay
                                slug={experienceSlug}
                                experienceSearchParam={experienceSearchParam}
                            />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}
