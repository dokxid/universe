"use client";

import { SidebarItemGroup } from "@/types/sidebar-item-group";
import { Settings, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { ItemGroup } from "./item-group";

export function AdminItemGroup() {
    const pathname = usePathname();
    const slug = pathname.split("/")[1];
    const adminItems: SidebarItemGroup = [
        {
            title: "Manage Members",
            href: `/${slug}/team/manage`,
            icon: Users,
        },
        {
            title: "Team Settings",
            href: `/${slug}/team/settings`,
            icon: Settings,
        },
    ];
    return (
        <ItemGroup items={adminItems} groupLabel="Admin Features"></ItemGroup>
    );
}
