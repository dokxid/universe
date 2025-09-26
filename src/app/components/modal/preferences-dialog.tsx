"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { MAP_TILES, setMapTiles } from "@/lib/features/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export function PreferencesDialog() {
    const settingsState = useAppSelector((state) => state.settings);
    const dispatch = useAppDispatch();
    const [open, setOpen] = React.useState(false);

    return (
        <div className={"flex flex-col gap-4"}>
            <p className={"text-sm text-muted-foreground"}>
                Select the map tiles you want to use.
            </p>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between"
                    >
                        {settingsState.mapTiles
                            ? Object.entries(MAP_TILES).find(([tileValue]) => {
                                  return tileValue === settingsState.mapTiles;
                              })?.[0]
                            : "Select map tiles..."}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput
                            placeholder="Search map tiles..."
                            className="h-9"
                        />
                        <CommandList>
                            <CommandEmpty>No map tile found.</CommandEmpty>
                            <CommandGroup>
                                {Object.entries(MAP_TILES).map(
                                    ([label, value]) => (
                                        <CommandItem
                                            key={value}
                                            value={value}
                                            onSelect={(currentValue) => {
                                                if (
                                                    currentValue ===
                                                    settingsState.mapTiles
                                                )
                                                    return;
                                                dispatch(setMapTiles(value));
                                                setOpen(false);
                                            }}
                                        >
                                            {label}
                                            <Check
                                                className={cn(
                                                    "ml-auto",
                                                    settingsState.mapTiles ===
                                                        value
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    )
                                )}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
