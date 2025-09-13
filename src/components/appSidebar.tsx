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
import {
    Book,
    BookOpenText,
    Building2,
    CheckIcon,
    ChevronsUpDownIcon,
    CircleQuestionMark,
    ListChecks,
    Map,
    SettingsIcon,
    Users,
} from "lucide-react";
import React from "react";
import {Button} from "./ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {cn} from "@/lib/utils";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {setFlyPosition, setZoomLevel} from "@/lib/features/map/map";
import {useExperiences} from "@/lib/data_hooks/experiencesHook";
import {Spinner} from "./ui/shadcn-io/spinner";
import {setCurrentExperience} from "@/lib/features/experiences/experiences";
import {ExperienceData} from "@/types/api";

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
    {
        title: "Settings",
        url: "#",
        icon: SettingsIcon,
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
    const [open, setOpen] = React.useState(false)
    const dispatch = useAppDispatch()
    const experiencesState = useAppSelector((state) => state.experiences)

    function ExperiencesList() {
        const {experiences, isLoading} = useExperiences()
        if (isLoading) return <Spinner/>
        // return <h1>Welcome back, {experiences[0].title}</h1>
        return experiences.map((exp: ExperienceData) => (
            <CommandItem
                key={exp._id.toString()}
                value={exp.slug}
                onSelect={(selectedValue) => {
                    if (selectedValue === experiencesState.currentExperience) {
                        return;
                    }
                    dispatch(setCurrentExperience(selectedValue))
                    setOpen(false)
                    dispatch(setFlyPosition(exp.center.coordinates))
                    dispatch(setZoomLevel(exp.initial_zoom))
                }}
            >
                <CheckIcon
                    className={cn(
                        "mr-2 h-4 w-4",
                        experiencesState.currentExperience === exp.slug ? "opacity-100" : "opacity-0"
                    )}
                />
                {exp.title}
            </CommandItem>
        ))
    }

    function CurrentExperienceDescriptor() {
        const {experiences, isLoading} = useExperiences()
        if (isLoading) return <Spinner/>
        const descriptor = experiencesState.currentExperience !== ""
            ? experiences.find((exp: ExperienceData) => exp.slug === experiencesState.currentExperience)
            : "Select Story experience..."
        return (
            <div className={"flex flex-col text-left w-full text-wrap"}>
                <p className={"text-xs"}>Current experience:</p>
                <p className={"font-bold"}>
                    {descriptor.title}
                </p>
                <p className={"text-xs"}>
                    {descriptor.subtitle ? descriptor.subtitle : ""}
                </p>
            </div>
        )
    }

    return (
        <Sidebar>

            {/* sidebar header */}
            <SidebarHeader className="mt-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between min-h-20 max-h20 bg-primary text-primary-foreground"
                                >
                                    <CurrentExperienceDescriptor/>
                                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput placeholder="Search experience..."/>
                                    <CommandList>
                                        <CommandEmpty>No experience found.</CommandEmpty>
                                        <CommandGroup>
                                            <ExperiencesList/>
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
