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
} from "@/components/ui/sidebar";
import { SidebarItemGroup } from "@/types/sidebar-item-group";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

export function ItemGroup({
    children,
    items,
    groupLabel,
}: {
    children?: React.ReactNode;
    items: SidebarItemGroup;
    groupLabel: string;
}) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
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
                        >
                            <item.icon />
                            <span>{item.title}</span>
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
