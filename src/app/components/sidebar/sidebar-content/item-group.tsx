"use client";

import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type SidebarItemGroup = {
    title: string;
    href: string;
    icon: React.ElementType;
    prefetch?: boolean;
    dropdownItems?: { title: string; href: string }[];
}[];

export function ItemGroup({
    children,
    items,
    groupLabel,
    defaultOpen = true,
}: {
    children?: React.ReactNode;
    items: SidebarItemGroup;
    groupLabel?: string;
    defaultOpen?: boolean;
}) {
    const { setOpenMobile } = useSidebar();
    const pathname = usePathname();

    return (
        <Collapsible defaultOpen={defaultOpen} className={"group/collapsible"}>
            <SidebarGroup className={"py-2 gap-0.5"}>
                {groupLabel && <SidebarGroupLabel
                    asChild
                    className={"font-[650] font-stretch-90%"}
                >
                    <CollapsibleTrigger
                        className={
                            "hover:font-[750] hover:*:stroke-2.5 transition-all duration-100 hover:text-accent-blue-foreground hover:cursor-pointer"
                        }
                    >
                        <ChevronDown className="mr-1 -ml-0.25 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        {groupLabel}
                    </CollapsibleTrigger>
                </SidebarGroupLabel>}
                {children}
                <CollapsibleContent>
                    {items.map((item) => (
                        <SidebarMenuItem
                            key={item.title}
                            className={
                                "flex flex-row justify-between items-center"
                            }
                        >
                            <SidebarMenuButton asChild>
                                <Link
                                    href={item.href}
                                    className={`flex items-center w-full transition-all duration-100 ${pathname === item.href
                                        ? "bg-accent-blue/50 group-hover/menu-item:bg-accent-blue! text-accent-blue-foreground group-hover/menu-item:text-accent-blue-foreground/90! font-semibold rounded-md"
                                        : "group-hover/menu-item:bg-accent-blue/30! group-hover/menu-item:font-semibold group-hover/menu-item:text-primary"
                                        }`}
                                    aria-label={item.title}
                                    onClick={() => setOpenMobile(false)}
                                    prefetch={item.prefetch || true}
                                >
                                    <item.icon
                                        className={`transition-all duration-100 group-hover/menu-item:rotate-3 ${pathname === item.href
                                            ? "stroke-accent-blue-foreground group-hover/menu-item:stroke-accent-blue-foreground/90!"
                                            : "stroke-muted-foreground group-hover/menu-item:stroke-primary"
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
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    );
}
