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
    CircleQuestionMark, ChevronsUpDownIcon, CheckIcon,
} from "lucide-react";
import {LngLat, LngLatBounds} from "maplibre-gl";
import React from "react";
import { Button } from "./ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {cn} from "@/lib/utils";
import {useAppDispatch} from "@/lib/hooks";
import {setFlyPosition, setZoomLevel} from "@/lib/features/map/map";

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

const available_experiences = [
    {
        label: "Universe Map",
        value: "universe",
        initial_center: [24.750592, 59.44435],
        initial_zoom: 5,
        bounds: new LngLatBounds(
            new LngLat(-180, -90),
            new LngLat(180, 90),
        )
    },
    {
        label: "Istanbul – Türkiye",
        value: "istanbul",
        initial_center: [28.951681, 41.016388],
        initial_zoom: 12,
        bounds: new LngLatBounds(
            new LngLat(90, -90),
            new LngLat(180, 90),
        )
    }
]

export function AppSidebar() {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState(available_experiences[0].value)
    const dispatch = useAppDispatch()
    return (
        <Sidebar>

            {/* sidebar header */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between"
                                >
                                    {value
                                        ? available_experiences.find((exp) => exp.value === value)?.label
                                        : "Select Story experience..."}
                                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput placeholder="Search framework..."/>
                                    <CommandList>
                                        <CommandEmpty>No framework found.</CommandEmpty>
                                        <CommandGroup>
                                            {available_experiences.map((exp) => (
                                                <CommandItem
                                                    key={exp.value}
                                                    value={exp.value}
                                                    onSelect={(currentValue) => {
                                                        setValue(currentValue === value ? "" : currentValue)
                                                        setOpen(false)
                                                        dispatch(setFlyPosition(exp.initial_center))
                                                        dispatch(setZoomLevel(exp.initial_zoom))
                                                    }}
                                                >
                                                    <CheckIcon
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            value === exp.value ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {exp.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
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
                                    <item.icon/>
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
                                    <item.icon/>
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
                                    <item.icon/>
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarGroup>

            </SidebarContent>
            <SidebarFooter>

            </SidebarFooter>
        </Sidebar>
    )
}
