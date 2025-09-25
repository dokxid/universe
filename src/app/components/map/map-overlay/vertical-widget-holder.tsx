"use client";

import { ExperienceDetails } from "@/app/components/map/experience-details";
import { FilterStoriesDialog } from "@/app/components/modal/filter-stories-dialog";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { decrementZoomLevel } from "@/lib/features/map/mapSlice";
import { setDescriptorOpen } from "@/lib/features/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Experience } from "@/types/api";
import { ArrowLeftToLine, ChevronsDownUp } from "lucide-react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

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
    selectedExperience,
    experiences,
    slug,
}: {
    selectedExperience: string | null;
    experiences: string;
    slug: string;
}) {
    const searchParams = useSearchParams();
    const expParam = selectedExperience;
    const isUniverseView =
        (slug === "universe" && !expParam) || expParam === "universe";
    const router = useRouter();
    const pathname = usePathname();
    const experiencesParsed = JSON.parse(experiences) as Experience[];

    const experienceParsed = useMemo(() => {
        if (!expParam)
            return experiencesParsed.find((exp) => exp.slug === slug);
        return experiencesParsed.find((exp) => exp.slug === expParam);
    }, [experiencesParsed, expParam, slug]);

    // hooks
    const settingsState = useAppSelector((state) => state.settings);
    const dispatch = useAppDispatch();

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
                <FilterStoriesDialog />
                {/* <Toggle
                    pressed={mapState.showConnections}
                    onPressedChange={(pressed) =>
                        dispatch(setShowConnections(pressed))
                    }
                    variant={"outline"}
                    className="pointer-events-auto size-10 hover:ring-2 bg-primary text-primary-foreground data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground"
                >
                    <Cable />
                </Toggle> */}
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
                        variant={"secondary"}
                        className={
                            "flex flex-row gap-2 items-center h-10 hover:ring-2"
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
                        onClick={() =>
                            dispatch(
                                setDescriptorOpen(!settingsState.descriptorOpen)
                            )
                        }
                        className={`h-10 flex flex-row gap-2 items-center hover:ring-2 ${
                            settingsState.descriptorOpen
                                ? "bg-primary text-primary-foreground hover:bg-primary hover:ring-secondary"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary hover:ring-primary"
                        }`}
                    >
                        <ChevronsDownUp className={"size-4"} />
                        <p className={"hidden lg:inline-block"}>
                            {settingsState.descriptorOpen
                                ? "Hide details"
                                : "About the Co-Lab"}
                        </p>
                    </Button>
                )}
            </div>
            <ExperienceDetails
                visible={settingsState.descriptorOpen && !isUniverseView}
                setOpenAction={(open) => dispatch(setDescriptorOpen(open))}
                experience={experienceParsed}
            />
        </>
    );
}
