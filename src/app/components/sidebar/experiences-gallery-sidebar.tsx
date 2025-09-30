"use client";

import { ListExperiencesSkeleton } from "@/components/skeletons/list-experiences-skeleton";
import { Card } from "@/components/ui/card";
import { DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { setRightSideBarOpen } from "@/lib/features/navigation/navigationSlice";
import { useAppSelector } from "@/lib/hooks";
import { Experience } from "@/types/api";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, use, useState } from "react";
import { useDispatch } from "react-redux";

function ExperienceGallerySidebarContent({
    experiences,
}: {
    experiences: Experience[];
}) {
    const searchParams = useSearchParams();
    const [experiencesSearchTerm, setExperiencesSearchTerm] = useState("");
    const filteredExperiences = experiences.filter((experiences) =>
        experiences.title
            .toLowerCase()
            .includes(experiencesSearchTerm.toLowerCase())
    );
    const selectedExperience = searchParams.get("exp");

    function createExperienceParam(slug: string) {
        const search = new URLSearchParams(searchParams.toString());
        search.set("exp", slug);
        return "?" + search.toString();
    }
    return (
        <div className={"flex flex-col w-full items-start gap-5 p-2 md:p-5"}>
            <article className="prose dark:prose-invert prose-sm">
                <h1>Heritage Labs</h1>
                <p className="text-muted-foreground">
                    To support the communities, this public access, independent
                    online platform brings together a multidisciplinary team of
                    researchers, educators, web developers, and community
                    organizers. HeritageLab’s ambition to understand personal
                    connections as a way to incorporate self-reflection into the
                    meaning of a location. Our contributors do not aim toward a
                    solution-oriented approach but rather consider heritage as a
                    matter of ethics and practice.
                </p>
            </article>
            {/* <CurrentExperienceSelector
            experiences={experiences}
            className={"p-2 md:p-5"}
        /> */}
            <Separator className="w-full my-2" />
            <div className={"w-full flex flex-col gap-3"}>
                <Label htmlFor="Search experiences">Search experiences</Label>
                <Input
                    value={experiencesSearchTerm}
                    onChange={(e) => setExperiencesSearchTerm(e.target.value)}
                    type="text"
                    placeholder="Search experiences..."
                    className={"bg-input"}
                />
            </div>
            <div className="grid grid-flow-row-dense grid-cols-1 gap-5 w-full">
                {filteredExperiences.map((experience: Experience) => (
                    <Card
                        key={experience.slug}
                        className={`w-full mx-auto py-0 flex-col hover:bg-accent shadow-none gap-0 h-60 group ${
                            experience.slug === selectedExperience
                                ? "bg-secondary text-secondary-foreground"
                                : ""
                        }`}
                    >
                        <div className="overflow-hidden rounded-t-md group-hover:hidden shrink">
                            <AspectRatio ratio={16 / 9}>
                                {experience.featured_image ? (
                                    <Suspense
                                        fallback={<ListExperiencesSkeleton />}
                                    >
                                        <Image
                                            src={experience.featured_image}
                                            alt={experience.title}
                                            fill={true}
                                            sizes="(min-width: 768px) 50vw, 100vw"
                                            className="group-hover:opacity-75 group-hover:scale-105 transition-all duration-200 object-cover"
                                        />
                                    </Suspense>
                                ) : (
                                    <div className="w-full h-full bg-muted rounded-t-md flex items-center justify-center">
                                        <span className="text-muted-foreground text-sm">
                                            No image
                                        </span>
                                    </div>
                                )}
                            </AspectRatio>
                        </div>
                        <div className="p-4 group flex flex-row items-center grow h-fit max-h-60 overflow-y-hidden">
                            <div className="flex flex-row items-center w-full gap-2 justify-between h-fit">
                                <Link
                                    key={experience.slug}
                                    href={`/universe/map${createExperienceParam(
                                        experience.slug
                                    )}`}
                                    prefetch={false}
                                    className="flex flex-row items-center w-full gap-2"
                                >
                                    <div className="flex-1 min-w-0 flex flex-col gap-0">
                                        <h2 className="text-base font-semibold truncate group-hover:after:content-['_↗'] group-hover:underline">
                                            {experience.title}
                                        </h2>
                                        <h3 className="text-sm text-muted-foreground line-clamp-1 group-hover:line-clamp-2">
                                            {experience.subtitle}
                                        </h3>
                                        <p
                                            className={
                                                "text-xs text-muted-foreground line-clamp-1 group-hover:line-clamp-6 mt-0.5 group-hover:mt-4"
                                            }
                                        >
                                            {experience.description}
                                        </p>
                                    </div>
                                </Link>
                                {/* <div className="shrink-0 ml-2">
                                        <ChevronRight className="size-4" />
                                    </div> */}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export function ExperiencesGallerySidebar({
    slug,
    experiencesPromise,
}: {
    slug: string;
    experiencesPromise: Promise<Experience[]>;
}) {
    const isMobile = useIsMobile();
    const experiences = use(experiencesPromise);
    const navigationState = useAppSelector((state) => state.navigation);
    const dispatch = useDispatch();

    if (slug !== "universe") return null;
    if (!experiences) return <div>No experiences found.</div>;
    if (!navigationState.rightSideBarOpen) return null;
    if (isMobile) {
        return (
            <Drawer
                open={navigationState.rightSideBarOpen}
                onOpenChange={(open) => dispatch(setRightSideBarOpen(open))}
            >
                <DrawerContent>
                    <VisuallyHidden>
                        <DialogTitle>Experiences</DialogTitle>
                    </VisuallyHidden>
                    <div className={"overflow-y-auto p-2"}>
                        <ExperienceGallerySidebarContent
                            experiences={experiences}
                        />
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <div
            className={`bg-sidebar text-sidebar-foreground max-w-[20rem] flex h-screen flex-col overflow-y-auto`}
        >
            <ExperienceGallerySidebarContent experiences={experiences} />
        </div>
    );
}
