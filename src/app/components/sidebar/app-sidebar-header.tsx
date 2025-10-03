"use client";

import LabHeader from "@/app/components/sidebar/lab-header";
import { UniverseHeader } from "@/app/components/sidebar/universe-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Experience } from "@/types/dtos";
import { useParams } from "next/navigation";
import { Suspense, use } from "react";

export function AppSidebarHeader({
    experiencesPromise,
}: {
    experiencesPromise: Promise<Experience[]>;
}) {
    const { slug } = useParams<{ slug: string }>();
    const experiences = use(experiencesPromise);
    const experience = experiences.find((exp) => exp.slug === slug);
    if (!experience) {
        console.error("No experience found for slug:", slug);
        return (
            <Suspense
                fallback={<Skeleton className="w-full h-full"></Skeleton>}
            >
                <UniverseHeader />
            </Suspense>
        );
    }

    return (
        <>
            {slug === "universe" && (
                <Suspense
                    fallback={<Skeleton className="w-full h-full"></Skeleton>}
                >
                    <UniverseHeader />
                </Suspense>
            )}

            {slug !== "universe" && (
                <Suspense
                    fallback={<Skeleton className="w-full h-full"></Skeleton>}
                >
                    <LabHeader experience={experience} />
                </Suspense>
            )}
        </>
    );
}
