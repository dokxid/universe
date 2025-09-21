import { SidebarItemGroup } from "@/types/sidebar-item-group";
import { LayoutDashboard, List, ListCheck } from "lucide-react";
import { ItemGroup } from "./item-group";

const storiesItems: SidebarItemGroup = [
    {
        title: "Editor Dashboard",
        href: "/editor-dashboard",
        icon: LayoutDashboard,
        dropdownItems: [{ title: "Add Story", href: "/stories/create" }],
    },
    {
        title: "Manage Stories",
        href: "/stories",
        icon: List,
    },
    {
        title: "Elevation Requests",
        href: "/stories/elevation-requests",
        icon: ListCheck,
    },
];

export function StoriesItemGroup() {
    return <ItemGroup items={storiesItems} groupLabel="Stories"></ItemGroup>;
}
