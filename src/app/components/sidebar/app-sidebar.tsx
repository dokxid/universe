import { CurrentExperienceSelector } from "@/app/components/sidebar/current-experience-selector";
import { AboutItemGroup } from "@/app/components/sidebar/sidebar-content/about-item-group";
import { AdminItemGroup } from "@/app/components/sidebar/sidebar-content/admin-item-group";
import { EditorItemGroup } from "@/app/components/sidebar/sidebar-content/editor-item-group";
import { LinksItemGroup } from "@/app/components/sidebar/sidebar-content/links-item-group";
import {
    UniverseItemGroup,
    UserItemGroup,
} from "@/app/components/sidebar/sidebar-content/user-item-group";
import { UserWidget } from "@/app/components/sidebar/user-widget";
import { CurrentExperienceSelectorSkeleton } from "@/components/skeletons/current-experience-selector-skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUserOptional, isUserAdmin, isUserMember } from "@/data/auth";
import { getExperienceDTO, getExperiencesDTO } from "@/data/dto/experience-dto";
import { Experience } from "@/types/api";
import Image from "next/image";
import { Suspense } from "react";

export async function AppSidebar({ slug }: { slug: string }) {
    const experiencesSerialized = JSON.stringify(await getExperiencesDTO());
    const experience = (await getExperienceDTO(slug)) as Experience;
    const user = await getCurrentUserOptional();
    const isEditor = await isUserMember(user, slug);
    const isAdmin = await isUserAdmin(user, slug);

    return (
        <Sidebar variant={"inset"} className={"p-0"}>
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
                <SidebarHeader className="flex flex-col items-start border-b px-0 py-0">
                    {/* <Link href="/universe/map">
                        <p className="text-xs text-muted-foreground flex flex-row items-center">
                            <ChevronLeft className="inline mr-2" size={10} />
                            Back to universe view
                        </p>
                    </Link> */}
                    <AspectRatio ratio={16 / 9} className="relative w-full">
                        <Suspense
                            fallback={
                                <Skeleton
                                    className={
                                        "w-full h-full bg-primary rounded-none"
                                    }
                                />
                            }
                        >
                            <Image
                                // src={experience.featured_image}
                                src={
                                    "https://heritagelab.center/wp-content/uploads/2024/07/MS448_A4315_2_15_0032-Large-870x570.jpeg"
                                }
                                alt={""}
                                width={400}
                                height={400}
                                className="object-cover w-full h-full rounded-none"
                            />
                        </Suspense>
                    </AspectRatio>
                    <div className={"px-4 pt-2 pb-4"}>
                        <h1 className="font-semibold">{experience.title}</h1>
                        <p className="text-xs text-muted-foreground">
                            {experience.subtitle}
                        </p>
                    </div>
                </SidebarHeader>
            )}

            <SidebarContent className={"px-1"}>
                <UserItemGroup />
                {isEditor && <EditorItemGroup />}
                {isAdmin && <AdminItemGroup />}
                <UniverseItemGroup />
                <LinksItemGroup />
                <AboutItemGroup />
                {/* <div className="flex grow"></div> */}
            </SidebarContent>
            <SidebarFooter className={"px-4 py-3 border-t"}>
                <Suspense fallback={<div>Loading user...</div>}>
                    <UserWidget slug={slug} />
                </Suspense>
            </SidebarFooter>
        </Sidebar>
    );
}
