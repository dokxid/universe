"use server";

import React, { Suspense } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/appSidebar";
import { MapOverlay } from "@/components/map/mapOverlay";
import { getExperienceDTO, getPublicStoriesDTO } from "@/data/dto/story-dto";
import { MapPanel } from "@/components/map/mapPanel";

export default async function Home({
    params,
}: {
    params: Promise<{ labSlug: string }>;
}) {
    const { labSlug } = await params;
    const storiesPromise = getPublicStoriesDTO();
    const experiencePromise = getExperienceDTO(labSlug ?? "universe");
    // console.log(`resolved promise: ${await storiesPromise}`)

    return (
        <main>
            <SidebarProvider className={"relative flex h-screen w-screen"}>
                <div className={"flex-none"}>
                    <AppSidebar />
                </div>

                <div className="grow relative">
                    {/* map */}
                    <div className={"absolute z-20 w-full h-full"}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <MapPanel
                                labSlug={labSlug ?? "universe"}
                                experiencePromise={experiencePromise}
                                storiesPromise={storiesPromise}
                            ></MapPanel>
                        </Suspense>
                    </div>

                    {/* overlay */}
                    <div
                        className={
                            "absolute z-30 w-full h-full pointer-events-none"
                        }
                    >
                        <MapOverlay>
                            <SidebarTrigger
                                className={
                                    "pointer-events-auto size-10 bg-primary text-primary-foreground"
                                }
                            />
                        </MapOverlay>
                    </div>
                </div>
            </SidebarProvider>
        </main>
    );
}
