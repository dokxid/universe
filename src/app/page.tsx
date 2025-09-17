'use client'

import React from "react";
import dynamic from 'next/dynamic'
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/sidebar/appSidebar";
import {useAppDispatch} from "@/lib/hooks";
import {MapOverlay} from "@/components/map/mapOverlay";
import {setCurrentExperience} from "@/lib/features/experiences/experiencesSlice";
import {setFlyPosition, setZoomLevel} from "@/lib/features/map/mapSlice";
import {useExperience} from "@/lib/data_hooks/experiencesHook";
import {Spinner} from "@/components/ui/shadcn-io/spinner";
import {useParams} from "next/navigation";
import {DialogProvider} from "@/components/dialog/dialogProvider";

// make dynamic loading
const MyMap = dynamic(() => import('@/components/map/map'), {
    ssr: false,
})


export default function Home() {

    const labSlug = useParams<{ labSlug: string }>().labSlug || "universe"
    const {experience, isLoading} = useExperience(labSlug)
    const dispatch = useAppDispatch()

    // initialize experience unconditionally
    dispatch(setCurrentExperience(labSlug))

    if (isLoading) return <Spinner></Spinner>

    // fly to experience center after fetching
    dispatch(setFlyPosition(experience.center.coordinates))
    dispatch(setZoomLevel(experience.initial_zoom))

    return (
        <main>
            <DialogProvider/>
            <SidebarProvider className={"relative flex h-screen w-screen"}>
                <div className={"flex-none"}>
                    <AppSidebar/>
                </div>

                <div className="grow relative">
                    {/* map */}
                    <div className={"absolute z-20 w-full h-full"}>
                        <MyMap></MyMap>
                    </div>

                    {/* overlay */}
                    <div className={"absolute z-30 w-full h-full pointer-events-none"}>
                        <MapOverlay>
                            <SidebarTrigger
                                className={"pointer-events-auto size-10 bg-primary text-primary-foreground"}/>
                        </MapOverlay>
                    </div>
                </div>
            </SidebarProvider>
        </main>
    );
}
