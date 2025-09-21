import { CurrentExperienceSelector } from "@/app/components/sidebar/current-experience-selector";
import { AboutItemGroup } from "@/app/components/sidebar/sidebar-content/about-item-group";
import { FeatureItemGroup } from "@/app/components/sidebar/sidebar-content/feature-item-group";
import { StoriesItemGroup } from "@/app/components/sidebar/sidebar-content/stories-item-group";
import { TeamItemGroup } from "@/app/components/sidebar/sidebar-content/team-item-group";
import { UserWidget } from "@/app/components/sidebar/user-widget";
import { CurrentExperienceSelectorSkeleton } from "@/components/skeletons/current-experience-selector-skeleton";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getExperiencesDTO } from "@/data/dto/story-dto";
import { Suspense } from "react";

export async function AppSidebar({
    labSlug = "universe",
}: {
    labSlug?: string;
}) {
    const experiencesPromise = getExperiencesDTO();

    return (
        <Sidebar variant="inset">
            {/* sidebar header */}
            {labSlug === "universe" && (
                <SidebarHeader className="">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Suspense
                                fallback={<CurrentExperienceSelectorSkeleton />}
                            >
                                <CurrentExperienceSelector
                                    experiencesPromise={experiencesPromise}
                                />
                            </Suspense>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
            )}

            <SidebarContent>
                <FeatureItemGroup />
                <StoriesItemGroup />
                <TeamItemGroup />
                <AboutItemGroup />
            </SidebarContent>
            <SidebarFooter>
                <UserWidget />
            </SidebarFooter>
        </Sidebar>
    );
}
