"use client";

import { SidebarItemGroup } from "@/types/sidebar-item-group";
import { LayoutDashboard, List, ListCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { ItemGroup } from "./item-group";

export function EditorItemGroup({ visible }: { visible: boolean }) {
    const pathname = usePathname();
    const slug = pathname.split("/")[1];
    const editorItems: SidebarItemGroup = [
        {
            title: "Dashboard",
            href: `/${slug}/stories/dashboard`,
            icon: LayoutDashboard,
            dropdownItems: [
                { title: "Add Story", href: `/${slug}/stories/create` },
            ],
        },
        {
            title: "Manage Stories",
            href: `/${slug}/stories/manage`,
            icon: List,
        },
        {
            title: "Elevation Requests",
            href: `/${slug}/stories/elevation-requests`,
            icon: ListCheck,
        },
    ];
    if (!visible) {
        return null;
    }
    return (
        <ItemGroup items={editorItems} groupLabel="Editor Features"></ItemGroup>
    );
}
