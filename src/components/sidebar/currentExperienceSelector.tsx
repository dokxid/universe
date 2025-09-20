"use client";

import { ChevronsUpDownIcon } from "lucide-react";
import React, { Suspense } from "react";
import { Button } from "../ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CurrentExperienceDescriptor } from "./currentExperienceDescriptor";
import { ExperiencesList } from "./experiencesList";
import { CurrentExperienceDescriptorSkeleton } from "./currentExperienceDescriptorSkeleton";
import { useAppSelector } from "@/lib/hooks";

export function CurrentExperienceSelector() {
    const experiencesState = useAppSelector((state) => state.experiences);
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
                    <Suspense
                        fallback={<CurrentExperienceDescriptorSkeleton />}
                    >
                        <CurrentExperienceDescriptor
                            currentExperience={
                                experiencesState.currentExperience
                            }
                        />
                    </Suspense>
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search experience..." />
                    <CommandList>
                        <CommandEmpty>No experience found.</CommandEmpty>
                        <CommandGroup>
                            <ExperiencesList setOpen={setOpen} />
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
