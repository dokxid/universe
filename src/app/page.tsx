'use client'

import React from "react";
import dynamic from 'next/dynamic'
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/appSidebar";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {AddStoryDialog} from "@/components/addStoryDialog";
import {MapOverlay} from "@/components/mapOverlay";

// make dynamic loading
const MyMap = dynamic(() => import('../components/map'), {
    ssr: false,
})


export default function Home() {

    const dispatch = useAppDispatch()
    const addStoryDialogue = useAppSelector(state => state.addStoryDialogue)

    return (
        <main>
            <AddStoryDialog
                isOpen={addStoryDialogue.open}
                onOpenChange={() => dispatch({type: 'addStoryDialogue/setOpen'})}
            ></AddStoryDialog>
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
