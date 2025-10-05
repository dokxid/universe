"use client";

import { Earth, Grid2X2Check, TriangleAlert } from "lucide-react";
import { usePathname } from "next/navigation";
import { ItemGroup, SidebarItemGroup } from "./item-group";

export function SuperAdminItemGroup({ visible }: { visible: boolean }) {
    const pathname = usePathname();
    const slug = pathname.split("/")[1];
    const adminItems: SidebarItemGroup = [
        {
            title: "Manage Heritage Labs",
            href: `/universe/labs/manage`,
            icon: Earth,
        },
        {
            title: "Elevation Requests",
            href: `/${slug}/elevation-requests`,
            icon: Grid2X2Check,
        },
        {
            title: "Debug Settings",
            href: `/${slug}/debug-settings`,
            icon: TriangleAlert,
        },
    ];
    if (!visible) {
        return null;
    }
    return (
        <ItemGroup
            items={adminItems}
            groupLabel="Super Admin Features"
        ></ItemGroup>
    );
}
