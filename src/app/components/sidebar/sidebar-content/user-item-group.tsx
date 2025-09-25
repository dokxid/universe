"use client";

import { SidebarItemGroup } from "@/types/sidebar-item-group";
import { BookOpenText, List, Map, SettingsIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { ItemGroup } from "./item-group";

export function UserItemGroup() {
    const pathname = usePathname();
    const slug = pathname.split("/")[1];
    const featureItems: SidebarItemGroup = [
        {
            title: "Map View",
            href: `/${slug}/map`,
            icon: Map,
        },
        {
            title: "Story Experiences",
            href: `/${slug}/experiences`,
            icon: BookOpenText,
        },
        {
            title: "Map Preferences",
            href: `/${slug}/settings`,
            icon: SettingsIcon,
        },
        {
            title: "Story List",
            href: `/${slug}/stories`,
            icon: List,
        },
    ];

    return <ItemGroup items={featureItems} groupLabel="Features" />;
}
