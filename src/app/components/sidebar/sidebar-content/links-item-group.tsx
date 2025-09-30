"use client";

import { SidebarItemGroup } from "@/types/sidebar-item-group";
import { Link, Orbit } from "lucide-react";
import { usePathname } from "next/navigation";
import { ItemGroup } from "./item-group";

export function LinksItemGroup({
    isUniverseView,
}: {
    isUniverseView?: boolean;
}) {
    const pathname = usePathname();
    const slug = pathname.split("/")[1];

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
            title: "Universe View",
            href: `/universe/map`,
            icon: Orbit,
        },
        {
            title: "Heritage Lab Universe",
            href: "https://universe.heritagelab.center/",
            icon: Link,
        },
        {
            title: "CIE Website",
            href: "https://heritage-activities.org/",
            icon: Link,
        },
    ];
    return (
        <ItemGroup
            items={isUniverseView ? linksItemsIfUniverse : linksItemsIfLab}
            groupLabel="Links"
        ></ItemGroup>
    );
}
