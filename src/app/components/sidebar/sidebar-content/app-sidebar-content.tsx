"use client";

import { AboutItemGroup } from "@/app/components/sidebar/sidebar-content/about-item-group";
import { AdminItemGroup } from "@/app/components/sidebar/sidebar-content/admin-item-group";
import { EditorItemGroup } from "@/app/components/sidebar/sidebar-content/editor-item-group";
import { LinksItemGroup } from "@/app/components/sidebar/sidebar-content/links-item-group";
import { SuperAdminItemGroup } from "@/app/components/sidebar/sidebar-content/super-admin-item-group";
import { UserItemGroup } from "@/app/components/sidebar/sidebar-content/user-item-group";
import { SidebarContentSkeleton } from "@/components/skeletons/sidebar-content-skeleton";
import { SidebarContent } from "@/components/ui/sidebar";
import { useGetRoleInLab } from "@/lib/swr/user-hook";
import { useParams } from "next/navigation";

export function AppSidebarContent() {
    const { slug } = useParams<{ slug: string }>();
    const isUniverseView = slug === "universe";
    const { roleInLab, isLoading: isLoadingRoleInLab } = useGetRoleInLab(slug);

    if (isLoadingRoleInLab)
        return (
            <div className="px-4 grow">
                <SidebarContentSkeleton />{" "}
            </div>
        );

    // case super admin
    if (roleInLab === "superadmin") {
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

    // case part of current heritage lab org
    if (roleInLab === "admin" || roleInLab === "editor") {
        return (
            <SidebarContent className={"px-1 flex flex-col gap-1"}>
                <UserItemGroup isUniverseView={isUniverseView} />
                <EditorItemGroup visible={true} />
                <AdminItemGroup visible={roleInLab === "admin"} />
                <div className={"flex-grow"}></div>
                <LinksItemGroup isUniverseView={isUniverseView} />
                <AboutItemGroup />
            </SidebarContent>
        );
    }

    // case not logged in or not part of current heritage lab org
    return (
        <SidebarContent className={"px-1 flex flex-col gap-1"}>
            <UserItemGroup isUniverseView={isUniverseView} />
            <div className={"flex-grow"}></div>
            <LinksItemGroup isUniverseView={isUniverseView} />
            <AboutItemGroup />
        </SidebarContent>
    );
}
