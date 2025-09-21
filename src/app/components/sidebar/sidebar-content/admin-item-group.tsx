import { SidebarItemGroup } from "@/types/sidebar-item-group";
import { Users } from "lucide-react";
import { ItemGroup } from "./item-group";

const adminItems: SidebarItemGroup = [
    {
        title: "Manage Team",
        href: "/add-story",
        icon: Users,
    },
];

export function AdminItemGroup() {
    return (
        <ItemGroup items={adminItems} groupLabel="Admin Features"></ItemGroup>
    );
}
