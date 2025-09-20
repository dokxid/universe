"use server";

import { MapOverlay } from "@/components/map/mapOverlay";
import { MapPanel } from "@/components/map/mapPanel";
import { AppSidebar } from "@/components/sidebar/appSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getExperienceDTO, getPublicStoriesDTO } from "@/data/dto/story-dto";
import { Suspense } from "react";

export default async function Home({
    params,
}: {
    params: Promise<{ labSlug: string }>;
}) {
    let { labSlug } = await params;
    labSlug = labSlug ?? "universe";
    const storiesPromise = getPublicStoriesDTO();
    const experiencePromise = getExperienceDTO(labSlug ?? "universe");

    const [storiesSerialized, experienceSerialized] = await Promise.all([
        storiesPromise,
        experiencePromise,
    ]);

    return (
            <SidebarProvider className={"relative flex h-screen w-screen"}>
                <div className={"flex-none"}>
                    <AppSidebar labSlug={labSlug} />
                </div>

                <div className="grow relative">
                    {/* map */}
                    <div className={"absolute z-20 w-full h-full"}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <MapPanel
                                labSlug={labSlug ?? "universe"}
                                experienceSerialized={experienceSerialized}
                                storiesSerialized={storiesSerialized}
                            ></MapPanel>
                        </Suspense>
                    </div>

                    {/* overlay */}
                    <div
                        className={
                            "absolute z-30 w-full h-full pointer-events-none"
                        }
                    >
                        <Suspense fallback={<div>Loading...</div>}>
                            <MapOverlay>
                                <SidebarTrigger
                                    className={
                                        "pointer-events-auto size-10 bg-primary text-primary-foreground"
                                    }
                                />
                            </MapOverlay>
                        </Suspense>
                    </div>
                </div>
            </SidebarProvider>
    );
}
