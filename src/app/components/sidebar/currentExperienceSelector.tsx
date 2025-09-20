"use client";

import {ChevronsUpDownIcon} from "lucide-react";
import React, { use } from "react";
import {Button} from "@/components/ui/button";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandList,} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import CurrentExperienceDescriptor from "./currentExperienceDescriptor";
import {ExperiencesList} from "./experiencesList";
import {useAppSelector} from "@/lib/hooks";
import {ExperienceData} from "@/types/api";

export function CurrentExperienceSelector({experiencesPromise}: { experiencesPromise: Promise<string> }) {
    const experiencesState = useAppSelector((state) => state.experiences);
    const data = JSON.parse(use(experiencesPromise)) as ExperienceData[];
    const safeData = data.map((item) => ({
        ...item,
        stories: [...item.stories],
    }));
    const experience = safeData.filter((experience) => experience.slug === experiencesState.currentExperience).pop();
    if (!experience) {
        throw new Error("No experience found.")
    }
    const [open, setOpen] = React.useState(false);
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    role={"combobox"}
                    aria-expanded={open}
                    className={
                        "w-full justify-between min-h-20 max-h20 bg-primary text-primary-foreground"
                    }
                >
                    <CurrentExperienceDescriptor
                        experience={experience}
                    />
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search experience..."/>
                    <CommandList>
                        <CommandEmpty>No experience found.</CommandEmpty>
                        <CommandGroup>
                            <ExperiencesList experiences={safeData} setOpen={setOpen}/>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
