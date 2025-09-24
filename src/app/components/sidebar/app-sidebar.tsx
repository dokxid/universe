import { CurrentExperienceSelector } from "@/app/components/sidebar/current-experience-selector";
import { AboutItemGroup } from "@/app/components/sidebar/sidebar-content/about-item-group";
import { AdminItemGroup } from "@/app/components/sidebar/sidebar-content/admin-item-group";
import { EditorItemGroup } from "@/app/components/sidebar/sidebar-content/editor-item-group";
import { FeatureItemGroup } from "@/app/components/sidebar/sidebar-content/feature-item-group";
import { LinksItemGroup } from "@/app/components/sidebar/sidebar-content/links-item-group";
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
import { getCurrentUserOptional, isUserAdmin, isUserMember } from "@/data/auth";
import { getExperienceDTO, getExperiencesDTO } from "@/data/dto/experience-dto";
import { Experience } from "@/types/api";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export async function AppSidebar({ slug }: { slug: string }) {
    const experiencesSerialized = JSON.stringify(await getExperiencesDTO());
    const experience = (await getExperienceDTO(slug)) as Experience;
    const user = await getCurrentUserOptional();
    const isEditor = await isUserMember(user, slug);
    const isAdmin = await isUserAdmin(user, slug);

    return (
        <Sidebar variant={"inset"}>
            {/* sidebar header */}
            {slug === "universe" && (
                <SidebarHeader className="">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Suspense
                                fallback={<CurrentExperienceSelectorSkeleton />}
                            >
                                <CurrentExperienceSelector
                                    experiencesSerialized={
                                        experiencesSerialized
                                    }
                                />
                            </Suspense>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
            )}

            {slug !== "universe" && (
                <SidebarHeader className="flex flex-col items-start border-b px-4 py-3">
                    <Link href="/universe/map">
                        <p className="text-xs text-muted-foreground flex flex-row items-center">
                            <ChevronLeft className="inline mr-2" size={10} />
                            Back to universe view
                        </p>
                    </Link>
                    <h1 className="font-semibold">{experience.title}</h1>
                    <p className="text-xs text-muted-foreground">
                        {experience.subtitle}
                    </p>
                </SidebarHeader>
            )}

            <SidebarContent>
                <FeatureItemGroup />
                {isEditor && <EditorItemGroup />}
                {isAdmin && <AdminItemGroup />}
                <AboutItemGroup />
                <LinksItemGroup />
            </SidebarContent>
            <SidebarFooter className={"px-4 py-3 border-t"}>
                <Suspense fallback={<div>Loading user...</div>}>
                    <UserWidget slug={slug} />
                </Suspense>
            </SidebarFooter>
        </Sidebar>
    );
}
