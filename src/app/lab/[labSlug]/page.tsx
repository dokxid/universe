'use client'

import React from "react";
import dynamic from 'next/dynamic'
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/sidebar/appSidebar";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {AddStoryDialog} from "@/components/dialog/addStoryDialog";
import {MapOverlay} from "@/components/map/mapOverlay";
import {setAddStoryDialogOpen} from "@/lib/features/dialogue/addStoryDialogSlice";
import {ListExperiencesDialog} from "@/components/dialog/listExperiencesDialog";
import {setListExperienceDialogOpen} from "@/lib/features/dialogue/listExperiencesDialogSlice";
import {setCurrentExperience} from "@/lib/features/experiences/experiencesSlice";
import {useParams} from "next/navigation";
import {setFlyPosition, setZoomLevel} from "@/lib/features/map/mapSlice";
import {useExperience} from "@/lib/data_hooks/experiencesHook";
import {Spinner} from "@/components/ui/shadcn-io/spinner";

// make dynamic loading
const MyMap = dynamic(() => import('@/components/map/map'), {
    ssr: false,
})


export default function LabHome() {

    const params = useParams<{ labSlug: string }>()
    const {experience, isLoading} = useExperience(params!.labSlug)
    const dispatch = useAppDispatch()
    const addStoryDialogue = useAppSelector(state => state.addStoryDialog)
    const listExperiencesDialog = useAppSelector(state => state.listExperiencesDialog)

    if (isLoading) return <Spinner/>

    dispatch(setCurrentExperience(params!.labSlug))
    dispatch(setFlyPosition(experience.center.coordinates))
    dispatch(setZoomLevel(experience.initial_zoom))

    return (
        <main>
            <AddStoryDialog
                isOpen={addStoryDialogue.open}
                onOpenChange={() => dispatch(setAddStoryDialogOpen())}
            />
            <ListExperiencesDialog
                isOpen={listExperiencesDialog.open}
                onOpenChange={() => dispatch(setListExperienceDialogOpen())}
            />
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
