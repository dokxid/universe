"use client";

import { SidebarItemGroup } from "@/types/sidebar-item-group";
import { Link } from "lucide-react";
import { ItemGroup } from "./item-group";

export function LinksItemGroup() {
    const linksItems: SidebarItemGroup = [
        {
            title: "Heritage Lab Website",
            href: "https://heritagelab.center/",
            icon: Link,
        },
        {
            title: "CIE Website",
            href: "https://heritage-activities.org/",
            icon: Link,
        },
    ];
    return <ItemGroup items={linksItems} groupLabel="Links"></ItemGroup>;
}
