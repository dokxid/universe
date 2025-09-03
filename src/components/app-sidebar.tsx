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
import {LngLat, LngLatBounds} from "maplibre-gl";

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

const available_stories = [
    {
        title: "Universe Map",
        initial_center: new LngLat(24.750592, 59.44435),
        initial_zoom: 5,
        bounds: new LngLatBounds(
            new LngLat(-180, -90),
            new LngLat(180, 90),
        )
    },
    {
        title: "Istanbul – Türkiye",
        initial_center: new LngLat(41.016388, 28.951681),
        initial_zoom: 12,
        bounds: new LngLatBounds(
            new LngLat(90, -90),
            new LngLat(180, 90),
        )
    }
]

let active_story = available_stories[0]

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
                                    {active_story.title}
                                    <ChevronDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                                {available_stories.map((story, idx) => (
                                    <DropdownMenuItem key={idx}>
                                        <span>{story.title}</span>
                                    </DropdownMenuItem>
                                ))}
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