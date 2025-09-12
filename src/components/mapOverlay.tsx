'use client'

import React from "react";
import {Button} from "@/components/ui/button";
import {FilePenLineIcon, SquarePlusIcon} from "lucide-react";
import dynamic from "next/dynamic";
import {useAppDispatch} from "@/lib/hooks";

const Geocoder = dynamic(
    () => import("@mapbox/search-js-react").then(mod => ({default: mod.Geocoder})),
    {ssr: false}
);


export function MapOverlay({children}: { children: React.ReactNode }) {
    const dispatch = useAppDispatch()
    return (
        <div className={"relative w-full h-full"}>
            <div className={"absolute top-5 left-5 flex flex-row gap-3 pointer-events-auto"}>
                {children}
                <Geocoder
                    // if check, in case we don't want to use mapbox token anymore
                    accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
                    options={{
                        language: "en",
                        country: "US"
                    }}
                />
            </div>
            {/* vertical widget holder */}
            <div className={"absolute right-5 bottom-5 flex flex-col gap-3 pointer-events-auto"}>
                <Button variant={"outline"} size={"sm"} className={""}
                        onClick={() => dispatch({type: 'addStoryDialogue/setOpen'})}>
                    <SquarePlusIcon/>
                    <span>Add Story</span>
                </Button>
                <Button variant={"outline"} size={"sm"} className={""}>
                    <FilePenLineIcon/>
                    <span>View Stories</span>
                </Button>
            </div>
        </div>
    )
}