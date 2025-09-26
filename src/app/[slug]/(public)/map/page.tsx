import { MapOverlay } from "@/app/components/map/map-overlay/map-overlay";
import { MapPanel } from "@/app/components/map/map-panel";
import { AppSidebar } from "@/app/components/sidebar/app-sidebar";
import { getExperiencesDTO } from "@/data/dto/experience-dto";
import {
    getAllPublicStoriesDTO,
    getLabPublicStoriesDTO,
} from "@/data/dto/story-dto";
import { Suspense } from "react";

export const experimental_ppr = true;

export default async function MapView({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const { exp } = await searchParams;
    const { slug } = await params;
    let storiesPromise;
    if (slug === "universe") storiesPromise = getAllPublicStoriesDTO();
    else storiesPromise = getLabPublicStoriesDTO(slug);
    const experiencesPromise = getExperiencesDTO();
    const selectedExperience = exp && !Array.isArray(exp) ? exp : slug;

    const [storiesResult, experiencesResult] = await Promise.all([
        storiesPromise,
        experiencesPromise,
    ]);

    const storiesSerialized = JSON.stringify(storiesResult);
    const experiencesSerialized = JSON.stringify(experiencesResult);

    return (
        <div className="w-screen h-screen flex">
            <AppSidebar slug={slug} />
            <div className="flex grow">
                <div className="grow relative">
                    {/* map */}
                    <div className="absolute z-20 w-full h-full">
                        <Suspense fallback={<div>Loading...</div>}>
                            <MapPanel
                                experienceSlug={slug}
                                experiencesSerialized={experiencesSerialized}
                                storiesSerialized={storiesSerialized}
                            />
                        </Suspense>
                    </div>

                    {/* overlay */}
                    <div className="absolute z-30 w-full h-full pointer-events-none">
                        <Suspense fallback={<div>Loading...</div>}>
                            <MapOverlay
                                slug={slug}
                                selectedExperience={selectedExperience}
                            />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}
