"use client";

import {
    BookText,
    Contact,
    Earth,
    LibraryBig,
    Map,
    Orbit,
    Users,
} from "lucide-react";
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
            href: `/${slug}/experiences`,
            icon: Earth,
        },
        {
            title: "Featured Stories",
            href: `/${slug}/stories`,
            icon: LibraryBig,
        },
        {
            title: "Contact",
            href: `/universe/map`,
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
            title: "Lab Members",
            href: `/${slug}/stories`,
            icon: Users,
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
            title: "Contact",
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
