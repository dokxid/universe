"use client";

import { ListExperiencesSkeleton } from "@/components/skeletons/list-experiences-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/lib/hooks";
import { Experience } from "@/types/api";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, use, useState } from "react";

export function ExperiencesGallerySidebar({
    experiencesPromise,
}: {
    experiencesPromise: Promise<Experience[]>;
}) {
    const searchParams = useSearchParams();
    const experiences = use(experiencesPromise);
    const navigationState = useAppSelector((state) => state.navigation);
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

    if (!experiences) return <div>No experiences found.</div>;
    if (!navigationState.rightSideBarOpen) return null;

    return (
        <div
            className={
                "bg-sidebar text-sidebar-foreground flex h-full w-[25rem] flex-col overflow-y-auto"
            }
        >
            <div
                className={"flex flex-col w-full items-start gap-5 p-2 md:p-5"}
            >
                <article className="prose dark:prose-invert prose-sm">
                    <h1>Heritage Labs</h1>
                    <p className="text-muted-foreground">
                        To support the communities, this public access,
                        independent online platform brings together a
                        multidisciplinary team of researchers, educators, web
                        developers, and community organizers. HeritageLab’s
                        ambition to understand personal connections as a way to
                        incorporate self-reflection into the meaning of a
                        location. Our contributors do not aim toward a
                        solution-oriented approach but rather consider heritage
                        as a matter of ethics and practice.
                    </p>
                </article>
                {/* <CurrentExperienceSelector
                    experiences={experiences}
                    className={"p-2 md:p-5"}
                /> */}
                <Separator className="w-full my-2" />
                <div className={"w-full flex flex-col gap-3"}>
                    <Label htmlFor="Search experiences">
                        Search experiences
                    </Label>
                    <Input
                        value={experiencesSearchTerm}
                        onChange={(e) =>
                            setExperiencesSearchTerm(e.target.value)
                        }
                        type="text"
                        placeholder="Search experiences..."
                        className={"bg-input"}
                    />
                </div>
                <div className="grid grid-flow-row-dense grid-cols-1 gap-5 w-full">
                    {filteredExperiences.map((experience: Experience) => (
                        <Link
                            key={experience.slug}
                            href={`/universe/map${createExperienceParam(
                                experience.slug
                            )}`}
                            className="flex flex-row justify-between items-center w-full gap-2 group"
                        >
                            <Card
                                className={`w-full mx-auto py-0 flex-col hover:bg-accent shadow-none gap-0 ${
                                    experience.slug === selectedExperience
                                        ? "bg-accent text-accent-foreground"
                                        : ""
                                }`}
                            >
                                <AspectRatio ratio={16 / 9}>
                                    {experience.featured_image ? (
                                        <Suspense
                                            fallback={
                                                <ListExperiencesSkeleton />
                                            }
                                        >
                                            <Image
                                                src={experience.featured_image}
                                                alt={experience.title}
                                                fill={true}
                                                sizes="(min-width: 768px) 50vw, 100vw"
                                                className="rounded-t-md object-cover"
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
                                <CardContent className="p-4 group flex flex-row items-center">
                                    <div className="flex flex-row items-center w-full gap-2 justify-between h-fit">
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-md font-semibold group-hover:underline truncate">
                                                {experience.title}
                                            </h2>
                                            <p className="text-sm text-muted-foreground group-hover:underline truncate">
                                                {experience.subtitle}
                                            </p>
                                        </div>
                                        <div className="shrink-0 ml-2">
                                            <ChevronRight className="size-4" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                    {Array.from({ length: 16 }).map((_, index) => (
                        <ListExperiencesSkeleton key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}
