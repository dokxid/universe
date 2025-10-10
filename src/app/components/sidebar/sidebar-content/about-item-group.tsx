"use client";

import { BookKey, CircleQuestionMark } from "lucide-react";
import { usePathname } from "next/navigation";
import { ItemGroup, SidebarItemGroup } from "./item-group";

export function AboutItemGroup() {
    const slug = usePathname()?.split("/")[1] || "universe";
    const aboutItems: SidebarItemGroup = [
        {
            title: "Imprint",
            href: `/${slug}/legal/imprint`,
            icon: CircleQuestionMark,
        },
        {
            title: "Privacy Policy",
            href: `/${slug}/legal/privacy`,
            icon: BookKey,
        },
    ];

    return <ItemGroup items={aboutItems} groupLabel="Legal"></ItemGroup>;
}
