'use client'

import React from "react";
import {Button} from "@/components/ui/button";
import {ArrowLeftToLine, ChevronsDownUp, FilePenLineIcon, SquarePlusIcon} from "lucide-react";
import dynamic from "next/dynamic";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {setAddStoryDialogOpen} from "@/lib/features/dialogue/addStoryDialogSlice";
import {ExperienceDescriptor} from "@/components/map/experienceDescriptor";
import {setCurrentExperience} from "@/lib/features/experiences/experiencesSlice";
import {decrementZoomLevel} from "@/lib/features/map/mapSlice";
import {useParams} from "next/navigation";

const Geocoder = dynamic(
    () => import("@mapbox/search-js-react").then(mod => ({default: mod.Geocoder})),
    {ssr: false}
);

const geocoderTheme = {
    variables: {}
}

export function MapOverlay({children}: { children: React.ReactNode }) {

    const labSlug = useParams<{ labSlug: string }>().labSlug || "universe"
    const dispatch = useAppDispatch()
    const experiencesState = useAppSelector(state => state.experiences)
    const [openDescriptor, setOpenDescriptor] = React.useState(true)
    console.log(experiencesState.currentExperience)

    return (
        <div className={"relative w-full h-full"}>

            {/* navigation widget holder */}
            <div className={"absolute top-5 left-5 flex flex-col gap-3"}>
                <div className={"flex flex-row gap-3 pointer-events-auto h-10"}>
                    {children}
                    {/* TODO: make own search bar due to styling limitations */}
                    {experiencesState.currentExperience == "universe" &&
                        <Geocoder
                            accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
                            options={{
                                language: "en",
                                country: "US"
                            }}
                            theme={geocoderTheme}
                        />}
                    {labSlug == "universe" && experiencesState.currentExperience != "universe" &&
                        <Button
                            onClick={() => {
                                dispatch(setCurrentExperience("universe"))
                                dispatch(decrementZoomLevel())
                            }}
                            className={"flex flex-row gap-2 items-center bg-primary text-primary-foreground h-10 hover:bg-primary-foreground hover:text-primary"}
                        >
                            <ArrowLeftToLine className={"size-4"}/>
                            <p className={"text-xs hidden lg:inline-block"}>Back to universe view</p>
                        </Button>}
                    {experiencesState.currentExperience != "universe" &&
                        <Button
                            onClick={() => setOpenDescriptor(!openDescriptor)}
                            className={`h-10 flex flex-row gap-2 items-center ${openDescriptor ?
                                "bg-primary-foreground text-primary hover:bg-primary hover:text-primary-foreground" :
                                "bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary"}`}
                        >
                            <ChevronsDownUp className={"size-4"}/>
                            <p className={"text-xs hidden lg:inline-block"}>{openDescriptor ? "Hide Descriptor" : "Show Descriptor"}</p>
                        </Button>}
                </div>
                {experiencesState.currentExperience != "universe" && openDescriptor &&
                    <ExperienceDescriptor setOpen={setOpenDescriptor}/>}
            </div>

            {/* vertical widget holder */}
            <div className={"absolute right-5 bottom-5 flex flex-col gap-3 pointer-events-auto"}>
                <Button variant={"outline"} size={"sm"} className={""}
                        onClick={() => dispatch(setAddStoryDialogOpen())}>
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