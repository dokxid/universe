import { CurrentExperienceSelector } from "@/app/components/sidebar/current-experience-selector";
import { CurrentExperienceSelectorSkeleton } from "@/components/skeletons/current-experience-selector-skeleton";
import {
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getExperiencesDTO } from "@/data/dto/experience-dto";
import { Suspense } from "react";

export async function UniverseHeader() {
    const experiencesSerialized = JSON.stringify(await getExperiencesDTO());
    return (
        <SidebarHeader className="px-4 py-4">
            <SidebarMenu>
                <SidebarMenuItem>
                    <Suspense fallback={<CurrentExperienceSelectorSkeleton />}>
                        <CurrentExperienceSelector
                            experiencesSerialized={experiencesSerialized}
                        />
                    </Suspense>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
    );
}
