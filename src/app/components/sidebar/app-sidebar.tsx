"use client";

import { AppSidebarHeader } from "@/app/components/sidebar/app-sidebar-header";
import { AppSidebarContent } from "@/app/components/sidebar/sidebar-content/app-sidebar-content";
import { UserWidgetHolder } from "@/app/components/sidebar/user-widget-holder";
import { LabSidebarSkeleton } from "@/components/skeletons/lab-sidebar-skeleton";
import { UniverseSidebarSkeleton } from "@/components/skeletons/universe-sidebar-skeleton";
import { Sidebar, SidebarFooter } from "@/components/ui/sidebar";
import { useLab } from "@/lib/swr/labs-hook";
import { getLabSlugFromPathname } from "@/lib/utils/pathname";
import { usePathname } from "next/navigation";

export function AppSidebar() {
    const pathname = usePathname();
    const slug = getLabSlugFromPathname(pathname);
    const { lab: experience, isLoading, isError } = useLab(slug);
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
        return <div>Could not fetch experiences</div>;
    }
    if (!experience) {
        return <div>No lab found</div>;
    }

    return (
        <Sidebar variant={"sidebar"} sidebarBorder={false} className={"p-0"}>
            <AppSidebarHeader experience={experience} />
            <AppSidebarContent />
            <SidebarFooter className={"px-4 py-3"}>
                <UserWidgetHolder />
            </SidebarFooter>
        </Sidebar>
    );
}
