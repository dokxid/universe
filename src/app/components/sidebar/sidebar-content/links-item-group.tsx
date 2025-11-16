"use client";

import { SiGithub } from "@icons-pack/react-simple-icons";
import { Link, Orbit } from "lucide-react";
import { ItemGroup, SidebarItemGroup } from "./item-group";

export function LinksItemGroup({
    isUniverseView,
}: {
    isUniverseView?: boolean;
}) {
    const linksItemsIfUniverse: SidebarItemGroup = [
        {
            title: "GitHub Repository",
            href: "https://github.com/dokxid/universe",
            icon: SiGithub,
        },
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
            defaultOpen={false}
        ></ItemGroup>
    );
}
