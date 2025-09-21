import { SidebarItemGroup } from "@/types/sidebar-item-group";
import { BookOpenText, Building2, Map, SettingsIcon } from "lucide-react";
import { ItemGroup } from "./item-group";

const featureItems: SidebarItemGroup = [
    {
        title: "Universe Map",
        href: "/",
        icon: Map,
    },
    {
        title: "Co-Labs",
        href: "/add-story",
        icon: Building2,
    },
    {
        title: "Story Experiences",
        href: "/experiences",
        icon: BookOpenText,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: SettingsIcon,
    },
];

export function FeatureItemGroup() {
    return <ItemGroup items={featureItems} />;
}
