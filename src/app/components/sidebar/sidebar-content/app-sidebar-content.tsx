"use client";

import { AboutItemGroup } from "@/app/components/sidebar/sidebar-content/about-item-group";
import { AdminItemGroup } from "@/app/components/sidebar/sidebar-content/admin-item-group";
import { EditorItemGroup } from "@/app/components/sidebar/sidebar-content/editor-item-group";
import { LinksItemGroup } from "@/app/components/sidebar/sidebar-content/links-item-group";
import { SuperAdminItemGroup } from "@/app/components/sidebar/sidebar-content/super-admin-item-group";
import { UserItemGroup } from "@/app/components/sidebar/sidebar-content/user-item-group";
import { SidebarContent } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Experience } from "@/types/dtos";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { useParams } from "next/navigation";

export function AppSidebarContent({ experience }: { experience: Experience }) {
    const { slug } = useParams<{ slug: string }>();
    const { roles, loading, organizationId, user } = useAuth();
    const currentExperienceOrganizationId = experience.organization_id;
    const isUniverseView = slug === "universe";

    if (loading) return <Skeleton className={"h-10 w-full"} />;

    // ensure super admin organization id is defined
    if (!process.env.NEXT_PUBLIC_WORKOS_SUPER_ADMIN_ORG_ID) {
        throw new Error("Super admin org id is not defined");
    }

    // case super admin
    if (organizationId === process.env.NEXT_PUBLIC_WORKOS_SUPER_ADMIN_ORG_ID) {
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
