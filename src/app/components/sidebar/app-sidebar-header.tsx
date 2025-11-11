"use client";

import LabHeader from "@/app/components/sidebar/lab-header";
import { UniverseHeader } from "@/app/components/sidebar/universe-header";
import { LabDTO } from "@/types/dtos";
import { useParams } from "next/navigation";

export function AppSidebarHeader({ lab }: { lab: LabDTO }) {
    const { slug } = useParams<{ slug: string }>();
    if (!lab) {
        console.error("No lab found for slug:", slug);
        return <UniverseHeader />;
    }

    return (
        <>
            {slug === "universe" && <UniverseHeader />}
            {slug !== "universe" && <LabHeader lab={lab} />}
        </>
    );
}
