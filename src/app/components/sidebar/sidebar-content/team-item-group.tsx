import { SidebarGroupAction } from "@/components/ui/sidebar";
import { SidebarItemGroup } from "@/types/sidebar-item-group";
import { Link, Users } from "lucide-react";
import { ItemGroup } from "./item-group";

const teamItems: SidebarItemGroup = [
    {
        title: "Manage Team",
        href: "/add-story",
        icon: Users,
    },
];

export function TeamItemGroup() {
    return (
        <ItemGroup items={teamItems} groupLabel="Team">
        </ItemGroup>
    );
}
