import { UserWidget } from "@/components/sidebar/userWidget";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getExperiencesDTO } from "@/data/dto/story-dto";
import {
    Book,
    BookOpenText,
    Building2,
    CircleQuestionMark,
    ListChecks,
    Map,
    SettingsIcon,
    Users,
} from "lucide-react";
import Link from "next/link";
import { CurrentExperienceSelector } from "./currentExperienceSelector";

export async function AppSidebar({ labSlug }: { labSlug: string }) {
    const feature_items = [
        {
            title: "Universe Map",
            href: "/addstory",
            icon: Map,
        },
        {
            title: "Co-Labs / Research Teams",
            href: "/addstory",
            icon: Building2,
        },
        {
            title: "Story Experiences",
            href: "/addstory",
            icon: BookOpenText,
        },
        {
            title: "Settings",
            href: "/addstory",
            icon: SettingsIcon,
        },
    ];

    const team_items = [
        {
            title: "Manage Team",
            href: "/addstory",
            icon: Users,
        },
        {
            title: "Manage Stories",
            href: "/addstory",
            icon: Book,
        },
        {
            title: "Elevation Requests",
            href: "/addstory",
            icon: ListChecks,
        },
    ];

    const about_items = [
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

    const experiencePromise = getExperiencesDTO();

    return (
        <Sidebar>
            {/* sidebar header */}
            {labSlug == "universe" && (
                <SidebarHeader className="mt-3">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <CurrentExperienceSelector />
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
            )}

            <SidebarContent>
                {/* feature sidebar group */}
                <SidebarGroup>
                    <SidebarGroupLabel>Features</SidebarGroupLabel>
                    {feature_items.map((item) => (
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

                {/* team sidebar group */}
                <SidebarGroup>
                    <SidebarGroupLabel>Team</SidebarGroupLabel>
                    {team_items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                                <a>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarGroup>

                {/* about sidebar group */}
                <SidebarGroup>
                    <SidebarGroupLabel>Team</SidebarGroupLabel>
                    {about_items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                                <a>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <UserWidget />
            </SidebarFooter>
        </Sidebar>
    );
}
