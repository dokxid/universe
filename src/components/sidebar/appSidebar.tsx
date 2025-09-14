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
    ChevronsUpDownIcon,
    CircleQuestionMark,
    ListChecks,
    Map,
    SettingsIcon,
    Users,
} from "lucide-react";
import React from "react";
import {Button} from "../ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandList} from "@/components/ui/command";
import {ExperiencesList} from "@/components/sidebar/experiencesList";
import {CurrentExperienceDescriptor} from "@/components/map/currentExperienceDescriptor";
import {useAppDispatch} from "@/lib/hooks";
import {setListExperienceDialogOpen} from "@/lib/features/dialogue/listExperiencesDialog";
import {setCurrentExperience} from "@/lib/features/experiences/experiences";


export function AppSidebar() {

    const dispatch = useAppDispatch()
    const [open, setOpen] = React.useState(false)

    const feature_items = [
        {
            title: "Universe Map",
            action() {
                dispatch(setCurrentExperience("universe"))
            },
            icon: Map,
        },
        {
            title: "Co-Labs / Research Teams",
            action() {
                dispatch(setListExperienceDialogOpen())
            },
            icon: Building2,
        },
        {
            title: "Story Experiences",
            action() {
                dispatch(setListExperienceDialogOpen())
            },
            icon: BookOpenText,
        },
        {
            title: "Settings",
            action() {
                dispatch(setListExperienceDialogOpen())
            },
            icon: SettingsIcon,
        },
    ]

    const team_items = [
        {
            title: "Manage Team",
            action() {
                dispatch(setListExperienceDialogOpen())
            },
            icon: Users,
        },
        {
            title: "Manage Stories",
            action() {
                dispatch(setListExperienceDialogOpen())
            },
            icon: Book,
        },
        {
            title: "Elevation Requests",
            action() {
                dispatch(setListExperienceDialogOpen())
            },
            icon: ListChecks,
        },
    ]

    const about_items = [
        {
            title: "About Universe",
            action() {
                dispatch(setListExperienceDialogOpen())
            },
            icon: CircleQuestionMark,
        },
        {
            title: "How to use",
            action() {
                dispatch(setListExperienceDialogOpen())
            },
            icon: CircleQuestionMark,
        },
        {
            title: "Heritage Lab CIE Website",
            action() {
                dispatch(setListExperienceDialogOpen())
            },
            icon: CircleQuestionMark,
        },
        {
            title: "Copyright Notices",
            action() {
                dispatch(setListExperienceDialogOpen())
            },
            icon: CircleQuestionMark,
        },
    ]

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
                                            <ExperiencesList setOpen={setOpen}/>
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
                            <SidebarMenuButton onClick={() => item.action()} asChild>
                                <a>
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
                            <SidebarMenuButton onClick={() => item.action()} asChild>
                                <a>
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
                            <SidebarMenuButton onClick={() => item.action()} asChild>
                                <a>
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
