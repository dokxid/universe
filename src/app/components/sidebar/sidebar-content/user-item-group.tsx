"use client";

import { SidebarItemGroup } from "@/types/sidebar-item-group";
import { BookOpenText, BookText, List, Map, Orbit } from "lucide-react";
import { usePathname } from "next/navigation";
import { ItemGroup } from "./item-group";

export function UserItemGroup({ isUniverseView }: { isUniverseView: boolean }) {
    const pathname = usePathname();
    const slug = pathname.split("/")[1];
    const featureItemsIfUniverseView: SidebarItemGroup = [
        {
            title: "Universe View",
            href: `/universe/map`,
            icon: Orbit,
        },
        {
            title: "Co-Lab Commununities",
            href: `/${slug}/experiences`,
            icon: BookOpenText,
        },
        {
            title: "Story List",
            href: `/${slug}/stories`,
            icon: List,
        },
    ];
    const featureItemsIfLabView: SidebarItemGroup = [
        {
            title: "Map View",
            href: `/${slug}/map`,
            icon: Map,
        },
        {
            title: "Story List",
            href: `/${slug}/stories`,
            icon: List,
        },
        {
            title: "About the Heritage Lab",
            href: `/${slug}/about`,
            icon: BookText,
        },
    ];

    return (
        <ItemGroup
            items={
                isUniverseView
                    ? featureItemsIfUniverseView
                    : featureItemsIfLabView
            }
            groupLabel={isUniverseView ? "Universe" : "Heritage Lab"}
        />
    );
}
