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
            title: "Heritage Universe",
            href: `/universe/map`,
            icon: Orbit,
        },
        {
            title: "Heritage Labs",
            href: `/${slug}/experiences`,
            icon: BookOpenText,
        },
        {
            title: "Featured Stories",
            href: `/${slug}/stories`,
            icon: List,
        },
        {
            title: "Contact",
            href: `/universe/map`,
            icon: Orbit,
        },
    ];
    const featureItemsIfLabView: SidebarItemGroup = [
        {
            title: "About the Heritage Lab",
            href: `/${slug}/about`,
            icon: BookText,
        },
        {
            title: "Lab Members",
            href: `/${slug}/stories`,
            icon: List,
        },
        {
            title: "Story Collection",
            href: `/${slug}/stories`,
            icon: List,
        },
        {
            title: "Interactive Map",
            href: `/${slug}/map`,
            icon: Map,
        },
        {
            title: "Contact",
            href: `/${slug}/contact`,
            icon: List,
        },
    ];

    return (
        <ItemGroup
            items={
                isUniverseView
                    ? featureItemsIfUniverseView
                    : featureItemsIfLabView
            }
            groupLabel={isUniverseView ? "Explore Universe" : "Explore"}
        />
    );
}
