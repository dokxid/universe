import { UserWidget } from "@/app/components/sidebar/userWidget";
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
import { CurrentExperienceSelector } from "./currentExperienceSelector";
import { AboutItemGroup } from "./sidebar-content/about-item-group";
import { FeatureItemGroup } from "./sidebar-content/feature-item-group";
import { TeamItemGroup } from "./sidebar-content/team-item-group";

export async function AppSidebar({
    labSlug = "universe",
}: {
    labSlug?: string;
}) {
    const experiencesPromise = getExperiencesDTO();

    return (
        <Sidebar>
            {/* sidebar header */}
            {labSlug === "universe" && (
                <SidebarHeader className="mt-3">
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
                <TeamItemGroup />
                <AboutItemGroup />
            </SidebarContent>
            <SidebarFooter>
                <UserWidget />
            </SidebarFooter>
        </Sidebar>
    );
}
