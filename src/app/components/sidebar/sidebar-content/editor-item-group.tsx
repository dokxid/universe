import { SidebarItemGroup } from "@/types/sidebar-item-group";
import { LayoutDashboard, List, ListCheck } from "lucide-react";
import { ItemGroup } from "./item-group";

const editorItems: SidebarItemGroup = [
    {
        title: "Dashboard",
        href: "/stories/dashboard",
        icon: LayoutDashboard,
        dropdownItems: [{ title: "Add Story", href: "/stories/create" }],
    },
    {
        title: "Manage Stories",
        href: "/stories/manage",
        icon: List,
    },
    {
        title: "Elevation Requests",
        href: "/stories/elevation-requests",
        icon: ListCheck,
    },
];

export function EditorItemGroup() {
    return (
        <ItemGroup items={editorItems} groupLabel="Editor Features"></ItemGroup>
    );
}
