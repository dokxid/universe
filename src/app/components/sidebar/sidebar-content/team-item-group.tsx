import { SidebarItemGroup } from "@/types/sidebar-item-group";
import { Book, ListChecks, Users } from "lucide-react";
import { ItemGroup } from "./item-group";

const teamItems: SidebarItemGroup = [
    {
        title: "Manage Team",
        href: "/addstory",
        icon: Users,
    },
    {
        title: "Manage Stories",
        href: "/addstory",
        icon: Book,
    },
    {
        title: "Elevation Requests",
        href: "/addstory",
        icon: ListChecks,
    },
];

export function TeamItemGroup() {
    return <ItemGroup items={teamItems} />;
}
