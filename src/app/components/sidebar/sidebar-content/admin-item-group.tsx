import { SidebarItemGroup } from "@/types/sidebar-item-group";
import { Settings, Users } from "lucide-react";
import { ItemGroup } from "./item-group";

const adminItems: SidebarItemGroup = [
    {
        title: "Manage Members",
        href: "/members/manage",
        icon: Users,
    },
    {
        title: "Experience Settings",
        href: "/experience/manage",
        icon: Settings,
    },
];

export function AdminItemGroup() {
    return (
        <ItemGroup items={adminItems} groupLabel="Admin Features"></ItemGroup>
    );
}
