import { SidebarItemGroup } from "@/types/sidebar-item-group";
import { CircleQuestionMark } from "lucide-react";
import { ItemGroup } from "./item-group";

const aboutItems: SidebarItemGroup = [
    {
        title: "About Universe",
        href: "/about#about-universe",
        icon: CircleQuestionMark,
    },
    {
        title: "How to use",
        href: "/about#how-to-use",
        icon: CircleQuestionMark,
    },
    {
        title: "Copyright Notices",
        href: "/about#copyright-notices",
        icon: CircleQuestionMark,
    },
];

export function AboutItemGroup() {
    return <ItemGroup items={aboutItems} groupLabel="About"></ItemGroup>;
}
