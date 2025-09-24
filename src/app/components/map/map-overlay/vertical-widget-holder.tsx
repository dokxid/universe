"use client";

import { TagPicker } from "@/app/components/form/tag-picker";
import { ExperienceDescriptor } from "@/app/components/map/experience-descriptor";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { decrementZoomLevel, setTags } from "@/lib/features/map/mapSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Experience } from "@/types/api";
import { ArrowLeftToLine, ChevronsDownUp, Funnel } from "lucide-react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useMemo } from "react";

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

function FilterStoriesDialog() {
    const [open] = React.useState(false);
    const tagState = useAppSelector((state) => state.map.tags);
    const dispatch = useAppDispatch();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"secondary"} className="size-10 hover:ring-2">
                    <Funnel />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Filter stories</DialogTitle>
                    <DialogDescription>
                        Use the form below to filter stories by tags.
                    </DialogDescription>
                </DialogHeader>
                <TagPicker
                    selectedTags={tagState}
                    onTagsChange={(newTags) => dispatch(setTags(newTags))}
                    showLabel={open}
                />
            </DialogContent>
        </Dialog>
    );
}

export function VerticalWidgetHolder({
    experiences,
    slug,
}: {
    experiences: string;
    slug: string;
}) {
    const searchParams = useSearchParams();
    const expParam = searchParams.get("exp");
    const isUniverseView =
        (slug === "universe" && !expParam) || expParam === "universe";
    const router = useRouter();
    const pathname = usePathname();
    const experiencesParsed: Experience[] = JSON.parse(experiences);

    const experienceParsed = useMemo(() => {
        if (!expParam)
            return experiencesParsed.find((exp) => exp.slug === slug);
        return experiencesParsed.find((exp) => exp.slug === expParam);
    }, [experiencesParsed, expParam, slug]);

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
                <FilterStoriesDialog></FilterStoriesDialog>
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
                        onClick={() => setOpenDescriptor(!openDescriptor)}
                        className={`h-10 flex flex-row gap-2 items-center hover:ring-2 ${
                            openDescriptor
                                ? "bg-primary text-primary-foreground hover:bg-primary hover:ring-secondary"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary hover:ring-primary"
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
                    setOpenAction={setOpenDescriptor}
                    experience={experienceParsed}
                />
            )}
        </>
    );
}
