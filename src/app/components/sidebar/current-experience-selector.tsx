"use client";

import { ExperiencesList } from "@/app/components/sidebar/experiences-list";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { LabDTO } from "@/types/dtos";
import { ChevronsUpDownIcon } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import React from "react";
import CurrentExperienceDescriptor from "./current-experience-descriptor";

export function CurrentExperienceSelector({
    labs,
    className,
}: {
    labs: LabDTO[];
    className?: string;
}) {
    const [open, setOpen] = React.useState(false);
    const searchParams = useSearchParams();
    const safeData = labs.map((item) => ({
        ...item,
    }));
    const lab = safeData.find(
        (exp) => exp.slug === (searchParams.get("exp") ?? "universe")
    );
    if (!lab) {
        redirect("/universe/map");
    }
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className={cn("w-full", className)}>
                    <Button
                        variant={"default"}
                        role={"combobox"}
                        aria-expanded={open}
                        className={"justify-between min-h-20 w-full"}
                        aria-label={"Experience Selector"}
                    >
                        <CurrentExperienceDescriptor lab={lab} />
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search experience..." />
                    <CommandList>
                        <CommandEmpty>No experience found.</CommandEmpty>
                        <CommandGroup>
                            <ExperiencesList
                                labs={safeData}
                                currentLab={lab}
                                setOpen={setOpen}
                            />
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
