"use client";

import { SidebarItemGroup } from "@/types/sidebar-item-group";
import {
    BookOpenText,
    CircleQuestionMark,
    Globe,
    List,
    Map,
} from "lucide-react";
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
            title: "Story List",
            href: `/${slug}/stories`,
            icon: List,
        },
    ];

    return <ItemGroup items={featureItems} groupLabel="Co-Lab" />;
}

export function UniverseItemGroup() {
    const pathname = usePathname();
    const slug = pathname.split("/")[1];
    const featureItems: SidebarItemGroup = [
        {
            title: "About Universe",
            href: "/about#about-universe",
            icon: CircleQuestionMark,
        },
        {
            title: "Co-Lab Commununities",
            href: `/${slug}/experiences`,
            icon: BookOpenText,
        },
        {
            title: "Universe View",
            href: "/universe/map",
            icon: Globe,
        },
    ];

    return <ItemGroup items={featureItems} groupLabel="Universe" />;
}
