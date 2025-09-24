"use client";

import { SidebarItemGroup } from "@/types/sidebar-item-group";
import { Globe } from "lucide-react";
import { ItemGroup } from "./item-group";

export function LinksItemGroup() {
    const linksItems: SidebarItemGroup = [
        {
            title: "Heritage Lab Website",
            href: "https://heritagelab.center/",
            icon: Globe,
        },
        {
            title: "CIE Website",
            href: "https://heritage-activities.org/",
            icon: Globe,
        },
    ];
    return <ItemGroup items={linksItems} groupLabel="Links"></ItemGroup>;
}
