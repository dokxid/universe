"use client";

import { SidebarItemGroup } from "@/types/sidebar-item-group";
import { Link, Orbit } from "lucide-react";
import { ItemGroup } from "./item-group";

export function LinksItemGroup({
    isUniverseView,
}: {
    isUniverseView?: boolean;
}) {
    const linksItemsIfUniverse: SidebarItemGroup = [
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
    const linksItemsIfLab: SidebarItemGroup = [
        {
            title: "CIE Website",
            href: "https://heritage-activities.org/",
            icon: Link,
        },
        {
            title: "Universe View",
            href: `/universe/map`,
            icon: Orbit,
        },
        {
            title: "Heritage Lab Website",
            href: "https://heritagelab.center/",
            icon: Link,
        },
    ];
    return (
        <ItemGroup
            items={isUniverseView ? linksItemsIfUniverse : linksItemsIfLab}
            groupLabel="More"
        ></ItemGroup>
    );
}
