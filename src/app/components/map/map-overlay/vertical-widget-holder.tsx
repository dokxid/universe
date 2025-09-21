"use client";

import { ExperienceDescriptor } from "@/app/components/map/experience-descriptor";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { decrementZoomLevel } from "@/lib/features/map/mapSlice";
import { useAppDispatch } from "@/lib/hooks";
import { ExperienceData } from "@/types/models/experiences";
import { ArrowLeftToLine, ChevronsDownUp, Funnel } from "lucide-react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback } from "react";

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

export function VerticalWidgetHolder({
    experience,
    slug,
}: {
    experience: string;
    slug: string;
}) {
    const searchParams = useSearchParams();
    const expParam = searchParams.get("exp");
    const isUniverseView =
        (slug === "universe" && !expParam) || expParam === "universe";
    const router = useRouter();
    const pathname = usePathname();
    const experienceParsed: ExperienceData = JSON.parse(experience);

    // hooks
    const dispatch = useAppDispatch();
    const [openDescriptor, setOpenDescriptor] = React.useState(true);

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);

            return params.toString();
        },
        [searchParams]
    );

    return (
        <>
            <div className={"flex flex-row gap-3 pointer-events-auto h-10"}>
                <SidebarTrigger
                    variant={"secondary"}
                    className="pointer-events-auto size-10 hover:ring-2"
                />
                <Button variant={"secondary"} className="size-10 hover:ring-2">
                    <Funnel />
                </Button>
                {isUniverseView && (
                    <Geocoder
                        accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
                        options={{
                            language: "en",
                            country: "US",
                        }}
                        theme={geocoderTheme}
                    />
                )}
                {slug == "universe" && !isUniverseView && (
                    <Button
                        onClick={() => {
                            router.push(
                                pathname +
                                    "?" +
                                    createQueryString("exp", "universe")
                            );
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
                {!isUniverseView && (
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
            {!isUniverseView && openDescriptor && (
                <ExperienceDescriptor
                    setOpen={setOpenDescriptor}
                    experience={experienceParsed}
                />
            )}
        </>
    );
}
