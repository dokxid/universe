"use client";

import { AboutItemGroup } from "@/app/components/sidebar/sidebar-content/about-item-group";
import { AdminItemGroup } from "@/app/components/sidebar/sidebar-content/admin-item-group";
import { EditorItemGroup } from "@/app/components/sidebar/sidebar-content/editor-item-group";
import { LinksItemGroup } from "@/app/components/sidebar/sidebar-content/links-item-group";
import { SuperAdminItemGroup } from "@/app/components/sidebar/sidebar-content/super-admin-item-group";
import { UserItemGroup } from "@/app/components/sidebar/sidebar-content/user-item-group";
import { SidebarContent } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
    useAllowedToAddStory,
    useAllowedToSuperAdmin,
} from "@/lib/swr/user-hook";
import { ExperienceDTO } from "@/types/dtos";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { useParams } from "next/navigation";

export function AppSidebarContent({
    experience,
}: {
    experience: ExperienceDTO;
}) {
    const { slug } = useParams<{ slug: string }>();
    const { roles, loading, organizationId, user } = useAuth();
    const currentExperienceOrganizationId = experience.organizationId;
    const isUniverseView = slug === "universe";
    const { allowedToSuperAdmin, isLoading: isLoadingSuperAdmin } =
        useAllowedToSuperAdmin(slug);
    const { allowedToAddStory, isLoading: isLoadingAddStory } =
        useAllowedToAddStory(slug);

    if (loading || isLoadingSuperAdmin || isLoadingAddStory)
        return <Skeleton className={"h-10 w-full"} />;

    // case super admin
    if (allowedToSuperAdmin) {
        return (
            <SidebarContent className={"px-1 flex flex-col gap-1"}>
                <UserItemGroup isUniverseView={isUniverseView} />
                <SuperAdminItemGroup visible={true} />
                <AdminItemGroup visible={!isUniverseView} />
                <EditorItemGroup visible={!isUniverseView} />
                <div className={"flex-grow"}></div>
                <LinksItemGroup isUniverseView={isUniverseView} />
                <AboutItemGroup />
            </SidebarContent>
        );
    }

    // case not logged in or not part of current heritage lab org
    if (
        !user ||
        roles === undefined ||
        currentExperienceOrganizationId !== organizationId
    ) {
        return (
            <SidebarContent className={"px-1 flex flex-col gap-1"}>
                <UserItemGroup isUniverseView={isUniverseView} />
                <div className={"flex-grow"}></div>
                <LinksItemGroup isUniverseView={isUniverseView} />
                <AboutItemGroup />
            </SidebarContent>
        );
    }

    // case part of current heritage lab org
    return (
        <SidebarContent className={"px-1 flex flex-col gap-1"}>
            <UserItemGroup isUniverseView={isUniverseView} />
            <EditorItemGroup
                visible={roles.includes("editor") || roles.includes("admin")}
            />
            <AdminItemGroup visible={roles.includes("admin")} />
            <div className={"flex-grow"}></div>
            <LinksItemGroup isUniverseView={isUniverseView} />
            <AboutItemGroup />
        </SidebarContent>
    );
}
