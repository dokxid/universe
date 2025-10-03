"use client";

import { CircleQuestionMark } from "lucide-react";
import { ItemGroup, SidebarItemGroup } from "./item-group";

export function AboutItemGroup() {
    const aboutItems: SidebarItemGroup = [
        {
            title: "Imprint",
            href: "/about#imprint",
            icon: CircleQuestionMark,
        },
        {
            title: "Privacy Policy",
            href: "/about#privacy-policy",
            icon: CircleQuestionMark,
        },
    ];

    return <ItemGroup items={aboutItems} groupLabel="Legal"></ItemGroup>;
}
