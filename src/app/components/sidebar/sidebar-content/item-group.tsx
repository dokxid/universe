"use client";

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type SidebarItemGroup = {
    title: string;
    href: string;
    icon: React.ElementType;
    dropdownItems?: { title: string; href: string }[];
}[];

export function ItemGroup({
    children,
    items,
    groupLabel,
}: {
    children?: React.ReactNode;
    items: SidebarItemGroup;
    groupLabel: string;
}) {
    const { setOpenMobile } = useSidebar();
    const pathname = usePathname();

    return (
        <SidebarGroup className={"py-2 gap-0.5"}>
            <SidebarGroupLabel className={"font-semibold"}>
                {groupLabel}
            </SidebarGroupLabel>
            {children}
            {items.map((item) => (
                <SidebarMenuItem
                    key={item.title}
                    className={
                        "flex flex-row justify-between items-center group/menu_item"
                    }
                >
                    <SidebarMenuButton asChild>
                        <Link
                            href={item.href}
                            className={`flex items-center w-full ${
                                pathname === item.href
                                    ? "bg-accent text-blue-200 group-hover/menu_item:text-blue-100 font-semibold rounded-md"
                                    : "group-hover/menu_item:font-semibold group-hover/menu_item:text-primary"
                            }`}
                            aria-label={item.title}
                            onClick={() => setOpenMobile(false)}
                            prefetch={true}
                        >
                            <item.icon
                                className={`${
                                    pathname === item.href
                                        ? "stroke-blue-200 group-hover/menu_item:stroke-blue-100"
                                        : "stroke-muted-foreground group-hover/menu_item:stroke-primary"
                                }`}
                            />
                            <span>{item.title}</span>
                            {/* <ChevronRight
                                className={"ml-auto stroke-muted-foreground"}
                            /> */}
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarGroup>
    );
}
