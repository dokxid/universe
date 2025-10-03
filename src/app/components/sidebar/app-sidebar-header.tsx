"use client";

import LabHeader from "@/app/components/sidebar/lab-header";
import { UniverseHeader } from "@/app/components/sidebar/universe-header";
import { Experience } from "@/types/dtos";
import { useParams } from "next/navigation";

export function AppSidebarHeader({
    experiences,
}: {
    experiences: Experience[];
}) {
    const { slug } = useParams<{ slug: string }>();
    const experience = experiences.find((exp) => exp.slug === slug);
    if (!experience) {
        console.error("No experience found for slug:", slug);
        return <UniverseHeader />;
    }

    return (
        <>
            {slug === "universe" && <UniverseHeader />}
            {slug !== "universe" && <LabHeader experience={experience} />}
        </>
    );
}
