import { Button } from "@/components/ui/button";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarItemGroup } from "@/types/sidebar-item-group";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

export function ItemGroup({ items }: { items: SidebarItemGroup }) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Team</SidebarGroupLabel>
            {items.map((item) => (
                <SidebarMenuItem key={item.title} className={ "flex flex-row justify-between" }>
                    <SidebarMenuButton asChild>
                        <Link
                            href={item.href}
                            className="flex items-center w-full"
                        >
                            <item.icon />
                            <span>{item.title}</span>
                        </Link>
                    </SidebarMenuButton>
                    <Button variant={"ghost"} size={"icon"} className={"p-0"}>
                        <a href={item.href}>
                            <ChevronRightIcon size="16" />
                        </a>
                    </Button>
                </SidebarMenuItem>
            ))}
        </SidebarGroup>
    );
}
