import { SidebarItemGroup } from "@/types/sidebar-item-group";
import { CircleQuestionMark } from "lucide-react";
import { ItemGroup } from "./item-group";

const aboutItems: SidebarItemGroup = [
    {
        title: "About Universe",
        href: "/addstory",
        icon: CircleQuestionMark,
    },
    {
        title: "How to use",
        href: "/addstory",
        icon: CircleQuestionMark,
    },
    {
        title: "Heritage Lab CIE Website",
        href: "/addstory",
        icon: CircleQuestionMark,
    },
    {
        title: "Copyright Notices",
        href: "/addstory",
        icon: CircleQuestionMark,
    },
];

export function AboutItemGroup() {
    return <ItemGroup items={aboutItems} />;
}
