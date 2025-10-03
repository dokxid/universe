"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

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
    return (
        <SidebarGroup className={"py-2"}>
            <SidebarGroupLabel className={"font-semibold"}>
                {groupLabel}
            </SidebarGroupLabel>
            {children}
            {items.map((item) => (
                <SidebarMenuItem
                    key={item.title}
                    className={"flex flex-row justify-between items-center"}
                >
                    <SidebarMenuButton asChild>
                        <Link
                            href={item.href}
                            className={"flex items-center w-full"}
                            aria-label={item.title}
                            onClick={() => setOpenMobile(false)}
                        >
                            <item.icon className={"stroke-muted-foreground"} />
                            <span>{item.title}</span>
                            {/* <ChevronRight
                                className={"ml-auto stroke-muted-foreground"}
                            /> */}
                        </Link>
                    </SidebarMenuButton>
                    {item.dropdownItems && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuAction>
                                    <MoreHorizontal />
                                </SidebarMenuAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="right"
                                align="start"
                                aria-label={"Dropdown area for " + item.title}
                            >
                                {item.dropdownItems.map((dropdownItem) => (
                                    <DropdownMenuItem
                                        key={dropdownItem.title}
                                        aria-label={dropdownItem.title}
                                        asChild
                                    >
                                        <a href={dropdownItem.href}>
                                            <span>{dropdownItem.title}</span>
                                        </a>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </SidebarMenuItem>
            ))}
        </SidebarGroup>
    );
}
