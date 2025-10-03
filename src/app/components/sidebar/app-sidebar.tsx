import { AppSidebarHeader } from "@/app/components/sidebar/app-sidebar-header";
import { AppSidebarContent } from "@/app/components/sidebar/sidebar-content/app-sidebar-content";
import { UserWidgetHolder } from "@/app/components/sidebar/user-widget-holder";
import { Sidebar, SidebarFooter } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { getExperiencesDTO } from "@/data/dto/experience-dto";
import { Suspense } from "react";

export async function AppSidebar() {
    const experiencesPromise = getExperiencesDTO();
    return (
        <Sidebar variant={"sidebar"} sidebarBorder={false} className={"p-0"}>
            <Suspense fallback={<Skeleton className="w-full h-16"></Skeleton>}>
                <AppSidebarHeader experiencesPromise={experiencesPromise} />
            </Suspense>
            <Suspense
                fallback={<Skeleton className="w-full h-full"></Skeleton>}
            >
                <AppSidebarContent experiencesPromise={experiencesPromise} />
            </Suspense>
            <SidebarFooter className={"px-4 py-3"}>
                <Suspense fallback={<Skeleton className="w-full"></Skeleton>}>
                    <UserWidgetHolder />
                </Suspense>
            </SidebarFooter>
        </Sidebar>
    );
}
