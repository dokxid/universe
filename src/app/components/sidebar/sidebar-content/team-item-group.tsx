import { SidebarItemGroup } from "@/types/sidebar-item-group";
import { Book, ListChecks, Users } from "lucide-react";
import { ItemGroup } from "./item-group";

const teamItems: SidebarItemGroup = [
    {
        title: "Manage Team",
        href: "/add-story",
        icon: Users,
    },
    {
        title: "Manage Stories",
        href: "/add-story",
        icon: Book,
    },
    {
        title: "Elevation Requests",
        href: "/add-story",
        icon: ListChecks,
    },
];

export function TeamItemGroup() {
    return <ItemGroup items={teamItems} />;
}
