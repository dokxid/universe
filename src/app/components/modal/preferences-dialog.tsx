"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import {
    SettingsBoxContent,
    SettingsBoxForm,
    SettingsFormBox,
    SettingsFormDescription,
    SettingsFormTitle,
    SettingsLayout,
} from "@/app/components/layout/content-layout";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
    MAP_TILES,
    setMapTiles,
    setMarkerProjection,
} from "@/lib/redux/settings/settings-slice";
import { cn } from "@/lib/utils";

export function PreferencesDialog() {
    const settingsState = useAppSelector((state) => state.settings);
    const dispatch = useAppDispatch();
    const [open, setOpen] = React.useState(false);

    return (
        <SettingsLayout>
            <SettingsFormBox>
                <SettingsFormTitle>Map Tiles</SettingsFormTitle>
                <SettingsFormDescription>
                    Select the map tiles you want to use.
                </SettingsFormDescription>
                <SettingsBoxContent>
                    <SettingsBoxForm>
                        <div className="flex flex-col gap-2">
                            <Label>Available map tiles:</Label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-[200px] justify-between"
                                    >
                                        {Object.keys(MAP_TILES).find(
                                            (key) =>
                                                MAP_TILES[
                                                    key as keyof typeof MAP_TILES
                                                ] === settingsState.mapTiles
                                        ) ?? "Select map tiles"}
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
                                            <CommandEmpty>
                                                No map tile found.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {Object.entries(MAP_TILES).map(
                                                    ([label, value]) => (
                                                        <CommandItem
                                                            key={value}
                                                            value={value}
                                                            onSelect={(
                                                                currentValue
                                                            ) => {
                                                                if (
                                                                    currentValue ===
                                                                    settingsState.mapTiles
                                                                )
                                                                    return;
                                                                dispatch(
                                                                    setMapTiles(
                                                                        value
                                                                    )
                                                                );
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
                    </SettingsBoxForm>
                </SettingsBoxContent>
            </SettingsFormBox>
            <SettingsFormBox>
                <SettingsFormTitle>Layers</SettingsFormTitle>
                <SettingsFormDescription>
                    Select the marker projection you want to use.
                </SettingsFormDescription>
                <SettingsBoxContent>
                    <SettingsBoxForm>
                        <div className="flex flex-col gap-2">
                            <RadioGroup
                                defaultValue={settingsState.markerProjection}
                                onValueChange={(value) =>
                                    dispatch(
                                        setMarkerProjection(
                                            value as "viewport" | "map"
                                        )
                                    )
                                }
                            >
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem
                                        value={"viewport"}
                                        id="viewport"
                                    />
                                    <div className="grid gap-2">
                                        <Label htmlFor="terms">Viewport</Label>
                                        <p className="text-muted-foreground text-sm">
                                            Markers will be projected towards
                                            your viewport.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value={"map"} id="map" />
                                    <div className="grid gap-2">
                                        <Label htmlFor="terms">Map</Label>
                                        <p className="text-muted-foreground text-sm">
                                            Markers will be projected flat on
                                            the map.
                                        </p>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>
                    </SettingsBoxForm>
                </SettingsBoxContent>
            </SettingsFormBox>
        </SettingsLayout>
    );
}
