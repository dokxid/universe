"use client";

import { SidebarItemGroup } from "@/types/sidebar-item-group";
import { CircleQuestionMark } from "lucide-react";
import { ItemGroup } from "./item-group";

export function AboutItemGroup() {
    const aboutItems: SidebarItemGroup = [
        {
            title: "Copyright Notices",
            href: "/about#copyright-notices",
            icon: CircleQuestionMark,
        },
    ];

    return <ItemGroup items={aboutItems} groupLabel="About"></ItemGroup>;
}
