'use client'

import React from "react";
import dynamic from 'next/dynamic'
import {FilePenLineIcon, SquarePlusIcon} from 'lucide-react'
import {Button} from "@/components/ui/button"
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import {useAppSelector} from "@/lib/hooks";

// make dynamic loading
const MyMap = dynamic(() => import('../components/map'), {
    ssr: false,
})

export default function Home() {

    const addStoryDialogue = useAppSelector(state => state.addStoryDialogue)
    console.log(addStoryDialogue.open)

    return (

            <SidebarProvider>
                <AppSidebar/>
                <main>

                    {/* map */}
                    <div className="absolute z-0">
                        <MyMap></MyMap>
                    </div>

                    {/* overlay */}
                    <div className={""}>
                        <div className={"relative top-5 left-5"}>
                            <SidebarTrigger/>
                        </div>
                        {/* vertical widget holder */}
                        <div className={"absolute right-5 bottom-5 flex flex-col gap-3"}>
                            <Button variant={"outline"} size={"sm"} className={""}>
                                <SquarePlusIcon/>
                                <span>Add Story</span>
                            </Button>
                            <Button variant={"outline"} size={"sm"} className={""}>
                                <FilePenLineIcon/>
                                <span>View Stories</span>
                            </Button>
                        </div>
                    </div>

                </main>
            </SidebarProvider>
    );
}
