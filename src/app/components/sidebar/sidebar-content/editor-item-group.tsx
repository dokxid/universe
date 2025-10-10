"use client";

import { Newspaper } from "lucide-react";
import { usePathname } from "next/navigation";
import { ItemGroup, SidebarItemGroup } from "./item-group";

export function EditorItemGroup({ visible }: { visible: boolean }) {
    const pathname = usePathname();
    const slug = pathname.split("/")[1];
    const editorItems: SidebarItemGroup = [
        // {
        //     title: "Dashboard",
        //     href: `/${slug}/stories/dashboard`,
        //     icon: LayoutDashboard,
        // },
        {
            title: "Manage Stories",
            href: `/${slug}/stories/manage`,
            icon: Newspaper,
        },
    ];
    if (!visible) {
        return null;
    }
    return (
        <ItemGroup items={editorItems} groupLabel="Editor Features"></ItemGroup>
    );
}
