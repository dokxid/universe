import { AppSidebarHeader } from "@/app/components/sidebar/app-sidebar-header";
import { AppSidebarContent } from "@/app/components/sidebar/sidebar-content/app-sidebar-content";
import { UserWidgetHolder } from "@/app/components/sidebar/user-widget-holder";
import { Sidebar, SidebarFooter } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export async function AppSidebar({ slug }: { slug: string }) {
    return (
        <Sidebar variant={"inset"} className={"p-0"}>
            <AppSidebarHeader slug={slug}></AppSidebarHeader>
            <Suspense
                fallback={<Skeleton className="w-full h-full"></Skeleton>}
            >
                <AppSidebarContent slug={slug}></AppSidebarContent>
            </Suspense>
            <SidebarFooter className={"px-4 py-3"}>
                <Suspense fallback={<Skeleton className="w-full"></Skeleton>}>
                    <UserWidgetHolder slug={slug} />
                </Suspense>
            </SidebarFooter>
        </Sidebar>
    );
}
