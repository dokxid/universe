"use client";

import { ExperienceDescriptor } from "@/app/components/map/experience-descriptor";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { setCurrentExperience } from "@/lib/features/experiences/experiencesSlice";
import { decrementZoomLevel } from "@/lib/features/map/mapSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ExperienceData } from "@/types/models/experiences";
import { ArrowLeftToLine, ChevronsDownUp } from "lucide-react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import React from "react";

const Geocoder = dynamic(
    () =>
        import("@mapbox/search-js-react").then((mod) => ({
            default: mod.Geocoder,
        })),
    { ssr: false }
);

const geocoderTheme = {
    variables: {},
};

export function VerticalWidgetHolder({ experiences }: { experiences: string }) {
    const labSlug = useParams<{ labSlug: string }>().labSlug || "universe";
    const experiencesState = useAppSelector((state) => state.experiences);
    const dispatch = useAppDispatch();
    const [openDescriptor, setOpenDescriptor] = React.useState(true);
    const experiencesParsed: ExperienceData[] = JSON.parse(experiences);
    return (
        <>
            <div className={"flex flex-row gap-3 pointer-events-auto h-10"}>
                <SidebarTrigger className="pointer-events-auto size-10 bg-primary text-primary-foreground" />
                {experiencesState.currentExperience == "universe" && (
                    <Geocoder
                        accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
                        options={{
                            language: "en",
                            country: "US",
                        }}
                        theme={geocoderTheme}
                    />
                )}
                {labSlug == "universe" &&
                    experiencesState.currentExperience != "universe" && (
                        <Button
                            onClick={() => {
                                dispatch(setCurrentExperience("universe"));
                                dispatch(decrementZoomLevel());
                            }}
                            className={
                                "flex flex-row gap-2 items-center bg-primary text-primary-foreground h-10 hover:bg-primary-foreground hover:text-primary"
                            }
                        >
                            <ArrowLeftToLine className={"size-4"} />
                            <p className={"text-xs hidden lg:inline-block"}>
                                Back to universe view
                            </p>
                        </Button>
                    )}
                {experiencesState.currentExperience != "universe" && (
                    <Button
                        onClick={() => setOpenDescriptor(!openDescriptor)}
                        className={`h-10 flex flex-row gap-2 items-center ${
                            openDescriptor
                                ? "bg-primary-foreground text-primary hover:bg-primary hover:text-primary-foreground"
                                : "bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                        }`}
                    >
                        <ChevronsDownUp className={"size-4"} />
                        <p className={"text-xs hidden lg:inline-block"}>
                            {openDescriptor
                                ? "Hide Descriptor"
                                : "Show Descriptor"}
                        </p>
                    </Button>
                )}
            </div>
            {experiencesState.currentExperience != "universe" &&
                openDescriptor && (
                    <ExperienceDescriptor
                        setOpen={setOpenDescriptor}
                        experiences={experiencesParsed}
                    />
                )}
        </>
    );
}
