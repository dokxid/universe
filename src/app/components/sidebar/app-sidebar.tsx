"use client";

import { AppSidebarHeader } from "@/app/components/sidebar/app-sidebar-header";
import { AppSidebarContent } from "@/app/components/sidebar/sidebar-content/app-sidebar-content";
import { UserWidgetHolder } from "@/app/components/sidebar/user-widget-holder";
import { LabSidebarSkeleton } from "@/components/skeletons/lab-sidebar-skeleton";
import { UniverseSidebarSkeleton } from "@/components/skeletons/universe-sidebar-skeleton";
import { Sidebar, SidebarFooter } from "@/components/ui/sidebar";
import { useExperiences } from "@/lib/data_hooks/experiences-hook";
import { usePathname } from "next/navigation";

export function AppSidebar() {
    const pathname = usePathname();
    const slug = pathname.split("/")[1];
    const { experiences, isLoading, isError } = useExperiences();
    if (!slug) {
        return null;
    }
    if (isLoading) {
        return slug === "universe" ? (
            <UniverseSidebarSkeleton />
        ) : (
            <LabSidebarSkeleton />
        );
    }
    if (isError) {
        return <div>Error loading experiences</div>;
    }
    if (!experiences) {
        return <div>No experiences found</div>;
    }

    return (
        <Sidebar variant={"sidebar"} sidebarBorder={false} className={"p-0"}>
            <AppSidebarHeader experiences={experiences} />
            <AppSidebarContent experiences={experiences} />
            <SidebarFooter className={"px-4 py-3"}>
                <UserWidgetHolder />
            </SidebarFooter>
        </Sidebar>
    );
}
