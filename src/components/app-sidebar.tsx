import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup, SidebarGroupLabel,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
    Book,
    Users,
    ListChecks,
    Map,
    Building2,
    BookOpenText,
    CircleQuestionMark, ChevronDown,
} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";

const feature_items = [
    {
        title: "Universe Map",
        url: "#",
        icon: Map,
    },
    {
        title: "Co-Labs / Research Teams",
        url: "#",
        icon: Building2,
    },
    {
        title: "Story Experiences",
        url: "#",
        icon: BookOpenText,
    },
]

const team_items = [
    {
        title: "Manage Team",
        url: "#",
        icon: Users,
    },
    {
        title: "Manage Stories",
        url: "#",
        icon: Book,
    },
    {
        title: "Elevation Requests",
        url: "#",
        icon: ListChecks,
    },
]

const about_items = [
    {
        title: "About Universe",
        url: "#",
        icon: CircleQuestionMark,
    },
    {
        title: "How to use",
        url: "#",
        icon: CircleQuestionMark,
    },
    {
        title: "Heritage Lab CIE Website",
        url: "#",
        icon: CircleQuestionMark,
    },
    {
        title: "Copyright Notices",
        url: "#",
        icon: CircleQuestionMark,
    },
]

export function AppSidebar() {
    return (
        <Sidebar>

            {/* sidebar header */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    Select Workspace
                                    <ChevronDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                                <DropdownMenuItem>
                                    <span>Acme Inc</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Acme Corp.</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>

                {/* feature sidebar group */}
                <SidebarGroup>
                    <SidebarGroupLabel>Features</SidebarGroupLabel>
                    {feature_items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                                <a href={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </a>
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
                                <a href={item.url}>
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
                                <a href={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarGroup>

            </SidebarContent>
            <SidebarFooter/>
        </Sidebar>
    )
}