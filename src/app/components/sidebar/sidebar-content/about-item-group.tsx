import { SidebarItemGroup } from "@/types/sidebar-item-group";
import { CircleQuestionMark, Link } from "lucide-react";
import { ItemGroup } from "./item-group";
import { SidebarGroupAction } from "@/components/ui/sidebar";

const aboutItems: SidebarItemGroup = [
    {
        title: "About Universe",
        href: "/add-story",
        icon: CircleQuestionMark,
    },
    {
        title: "How to use",
        href: "/add-story",
        icon: CircleQuestionMark,
    },
    {
        title: "Heritage Lab CIE Website",
        href: "/add-story",
        icon: CircleQuestionMark,
    },
    {
        title: "Copyright Notices",
        href: "/add-story",
        icon: CircleQuestionMark,
    },
];

export function AboutItemGroup() {
    return (
        <ItemGroup items={aboutItems} groupLabel="About">
        </ItemGroup>
    );
}
