import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarItemGroup } from "@/types/sidebar-item-group";
import Link from "next/link";

export function ItemGroup({ items }: { items: SidebarItemGroup }) {
    console.log(items);
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Team</SidebarGroupLabel>
            {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                        <Link
                            href={item.href}
                            className="flex items-start w-full"
                        >
                            <item.icon />
                            <span>{item.title}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarGroup>
    );
}
