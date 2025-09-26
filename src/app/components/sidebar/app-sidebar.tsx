import LabHeader from "@/app/components/sidebar/lab-header";
import { AppSidebarContent } from "@/app/components/sidebar/sidebar-content/app-sidebar-content";
import { UniverseHeader } from "@/app/components/sidebar/universe-header";
import { UserWidget } from "@/app/components/sidebar/user-widget";
import { Sidebar, SidebarFooter } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export async function AppSidebar({ slug }: { slug: string }) {
    if (!slug) {
        return <div>Loading...</div>;
    }

    return (
        <Sidebar variant={"inset"} className={"p-0"}>
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
                    <LabHeader slug={slug} />
                </Suspense>
            )}
            <Suspense
                fallback={<Skeleton className="w-full h-full"></Skeleton>}
            >
                <AppSidebarContent slug={slug}></AppSidebarContent>
            </Suspense>
            <SidebarFooter className={"px-4 py-3"}>
                <Suspense fallback={<Skeleton className="w-full"></Skeleton>}>
                    <UserWidget slug={slug} />
                </Suspense>
            </SidebarFooter>
        </Sidebar>
    );
}
