export type SidebarItemGroup = {
    title: string;
    href: string;
    icon: React.ElementType;
    dropdownItems?: { title: string; href: string }[];
}[];
