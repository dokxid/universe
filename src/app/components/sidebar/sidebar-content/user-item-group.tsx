"use client";

import { BookText, Contact, Earth, LibraryBig, Map, Orbit } from "lucide-react";
import { usePathname } from "next/navigation";
import { ItemGroup, SidebarItemGroup } from "./item-group";

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
            href: `/universe/labs`,
            icon: Earth,
        },
        {
            title: "Featured Stories",
            href: `/universe/stories`,
            icon: LibraryBig,
        },
        {
            title: "Contact Our Team",
            href: `/universe/contact`,
            icon: Contact,
        },
    ];
    const featureItemsIfLabView: SidebarItemGroup = [
        {
            title: "About the Heritage Lab",
            href: `/${slug}/about`,
            icon: BookText,
        },
        {
            title: "Story Collection",
            href: `/${slug}/stories`,
            icon: LibraryBig,
        },
        {
            title: "Interactive Map",
            href: `/${slug}/map`,
            icon: Map,
        },
        {
            title: "Contact Our Team",
            href: `/${slug}/contact`,
            icon: Contact,
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
