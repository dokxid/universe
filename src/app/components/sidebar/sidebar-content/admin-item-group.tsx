"use client";

import { Settings, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { ItemGroup, SidebarItemGroup } from "./item-group";

export function AdminItemGroup({ visible }: { visible: boolean }) {
    const pathname = usePathname();
    const slug = pathname.split("/")[1];
    const adminItems: SidebarItemGroup = [
        {
            title: "Manage Members",
            href: `/${slug}/lab/manage`,
            icon: Users,
        },
        {
            title: "Team Settings",
            href: `/${slug}/lab/settings`,
            icon: Settings,
        },
    ];
    if (!visible) {
        return null;
    }
    return (
        <ItemGroup items={adminItems} groupLabel="Admin Features"></ItemGroup>
    );
}
