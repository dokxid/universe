'use client'

import React from "react";
import dynamic from 'next/dynamic'
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/appSidebar";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {AddStoryDialogue} from "@/components/addStoryDialogue";
import {MapOverlay} from "@/components/mapOverlay";

// make dynamic loading
const MyMap = dynamic(() => import('../components/map'), {
    ssr: false,
})


export default function Home() {

    const dispatch = useAppDispatch()
    const addStoryDialogue = useAppSelector(state => state.addStoryDialogue)
    console.log(addStoryDialogue.open)

    return (
        <main>
            <AddStoryDialogue
                isOpen={addStoryDialogue.open}
                onOpenChange={() => dispatch({type: 'addStoryDialogue/setOpen'})}
            >
            </AddStoryDialogue>
            <SidebarProvider className={"relative flex h-screen w-screen"}>
                <AppSidebar className={"flex-none"}/>

                <div className="grow relative">
                    {/* map */}
                    <div className={"absolute z-20 w-full h-full"}>
                        <MyMap></MyMap>
                    </div>

                    {/* overlay */}
                    <div className={"absolute z-30 w-full h-full pointer-events-none"}>
                        <MapOverlay>
                            <SidebarTrigger/>
                        </MapOverlay>
                    </div>
                </div>
            </SidebarProvider>
        </main>
    );
}
