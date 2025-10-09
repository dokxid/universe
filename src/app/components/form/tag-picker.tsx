"use client";

import { TagList } from "@/app/components/cards/tag-list";
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
import { Toggle } from "@/components/ui/toggle";
import { groupByKey } from "@/lib/utils/group-by-key";
import { UnescoTagDTO, UnescoTagDTOWithCount } from "@/types/dtos";
import { Check, PlusIcon, Tag, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "../../../components/ui/badge";

// Base component - no form binding
interface TagPickerFilterProps {
    availableTags: UnescoTagDTOWithCount[];
    selectedTags?: string[];
    onTagsChange?: (tags: string[]) => void;
    className?: string;
    showLabel?: boolean;
}

interface TagPickerFormProps {
    availableTags: UnescoTagDTO[];
    selectedTags?: string[];
    onTagsChange?: (tags: string[]) => void;
    className?: string;
    showLabel?: boolean;
}

export function TagPickerForm({
    availableTags,
    selectedTags = [],
    onTagsChange,
    className,
    showLabel = true,
}: TagPickerFormProps) {
    const [inputTags, setInputTags] = useState<UnescoTagDTO[]>([]);
    const [tagPickerOpen, setTagPickerOpen] = useState<boolean>(false);

    // sync inputTags with selected tags
    useEffect(() => {
        if (availableTags && selectedTags) {
            const tagObjects = availableTags.filter((tag) =>
                selectedTags.includes(tag.name)
            );
            setInputTags(tagObjects);
        }
    }, [availableTags, selectedTags]);

    const handleMouseEnter = () => {
        setTagPickerOpen(true);
    };

    const handleTagRemove = (tagToRemove: UnescoTagDTO) => {
        const newTags = inputTags.filter((t) => t !== tagToRemove);
        setInputTags(newTags);
        onTagsChange?.(newTags.map((tag) => tag.name));
    };

    const handleTagAdd = (tagToAdd: UnescoTagDTO) => {
        if (inputTags.find((t) => t.name === tagToAdd.name)) {
            return;
        }
        const newTags = [...inputTags, tagToAdd];
        setInputTags(newTags);
        setTagPickerOpen(false);
        onTagsChange?.(newTags.map((tag) => tag.name));
    };

    // prepare grouped tags for display
    const sanitizedTags = availableTags.map((tag) => ({
        ...tag,
        category: `${tag.theme} | ${tag.category}`,
    }));
    const groupedTags = groupByKey(sanitizedTags, (tag) => tag.category);

    return (
        <div
            className={`col-span-12 col-start-auto space-y-0 items-start ${
                className || ""
            }`}
        >
            {showLabel && <p className={"text-sm font-medium"}>Tags</p>}
            <Popover
                open={tagPickerOpen}
                onOpenChange={setTagPickerOpen}
                modal={true}
            >
                <div className={"flex flex-wrap gap-2 my-3"}>
                    {inputTags.map((tag) => (
                        <Badge
                            style={{
                                backgroundColor: tag.color,
                            }}
                            key={tag._id}
                            variant={"tag"}
                            onClick={() => {
                                handleTagRemove(tag);
                            }}
                            className={"group"}
                        >
                            <p>{tag.name}</p>
                            <X
                                className={
                                    "stroke-3 group-hover:text-destructive"
                                }
                            />
                        </Badge>
                    ))}
                    <PopoverTrigger asChild>
                        <Badge
                            onClick={handleMouseEnter}
                            variant={"tag"}
                            className={
                                (tagPickerOpen
                                    ? "bg-primary-foreground text-primary"
                                    : "bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground") +
                                " cursor-pointer transition-all duration-300"
                            }
                        >
                            Add Tag
                            <PlusIcon />
                        </Badge>
                    </PopoverTrigger>
                </div>
                <PopoverContent className="p-2">
                    <Command>
                        <CommandInput placeholder="Search UNESCO tags..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            {Object.entries(groupedTags).map(
                                ([category, tagsInCategory]) => (
                                    <CommandGroup
                                        key={category}
                                        heading={category}
                                    >
                                        {tagsInCategory.map((tag) => (
                                            <CommandItem
                                                key={tag.name}
                                                onSelect={() => {
                                                    handleTagAdd(tag);
                                                }}
                                            >
                                                <Tag
                                                    className={"stroke-primary"}
                                                    style={{
                                                        fill: tag.color,
                                                        strokeWidth: 1.5,
                                                        stroke: "#333",
                                                    }}
                                                ></Tag>
                                                {tag.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}

export function TagPickerFilter({
    availableTags,
    selectedTags = [],
    onTagsChange,
    className,
    showLabel = true,
}: TagPickerFilterProps) {
    const [inputTags, setInputTags] = useState<UnescoTagDTOWithCount[]>([]);
    const [inputTagStrings, setInputTagStrings] = useState<string[]>([]);
    const [tagPickerOpen, setTagPickerOpen] = useState<boolean>(false);
    const searchParams = useSearchParams();

    const tagParams = searchParams.get("tags")?.split(",") || [];

    // sync inputTags with selected tags
    useEffect(() => {
        if (availableTags && selectedTags) {
            const tagObjects = availableTags.filter((tag) =>
                selectedTags.includes(tag.name)
            );
            setInputTags(tagObjects);
            setInputTagStrings(tagObjects.map((tag) => tag.name));
        }
    }, [availableTags, selectedTags]);

    useEffect(() => {
        if (tagParams.length > 0 && availableTags) {
            const tagObjects = availableTags.filter((tag) =>
                tagParams.includes(tag.name)
            );
            setInputTags(tagObjects);
            onTagsChange?.(tagObjects.map((tag) => tag.name));
            setInputTagStrings(tagObjects.map((tag) => tag.name));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, availableTags]);

    const handleMouseEnter = () => {
        setTagPickerOpen(true);
    };

    const handleTagAdd = (tagToAdd: UnescoTagDTOWithCount) => {
        if (inputTags.find((t) => t.name === tagToAdd.name)) {
            return;
        }
        const newTags = [...inputTags, tagToAdd];
        setInputTags(newTags);
        setInputTagStrings(newTags.map((tag) => tag.name));
        setTagPickerOpen(false);
        onTagsChange?.(newTags.map((tag) => tag.name));
    };

    // prepare grouped tags for display
    const sanitizedTags = availableTags.map((tag) => ({
        ...tag,
        category: `${tag.theme} | ${tag.category}`,
    }));
    const groupedTags = groupByKey(sanitizedTags, (tag) => tag.category);

    return (
        <div
            className={`col-span-12 col-start-auto space-y-0 items-start ${
                className || ""
            }`}
        >
            {showLabel && <p className={"text-sm font-medium"}>Tags</p>}
            <Popover
                open={tagPickerOpen}
                onOpenChange={setTagPickerOpen}
                modal={true}
            >
                <div className={"flex flex-wrap gap-2 mt-1"}>
                    <PopoverTrigger asChild>
                        <Toggle
                            variant={"primary_custom"}
                            onPressedChange={setTagPickerOpen}
                            pressed={tagPickerOpen}
                            onClick={handleMouseEnter}
                        >
                            Add Tag
                            <PlusIcon />
                        </Toggle>
                    </PopoverTrigger>
                    <TagList tags={inputTagStrings} variant={"remove"} />
                </div>
                <PopoverContent className="p-2">
                    <Command>
                        <CommandInput placeholder="Search UNESCO tags..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            {Object.entries(groupedTags).map(
                                ([category, tagsInCategory]) => (
                                    <CommandGroup
                                        key={category}
                                        heading={category}
                                    >
                                        {tagsInCategory.map((tag) => (
                                            <CommandItem
                                                key={tag._id}
                                                onSelect={() => {
                                                    handleTagAdd(tag);
                                                }}
                                            >
                                                <Tag
                                                    className={"stroke-primary"}
                                                    style={{
                                                        fill: tag.color,
                                                        strokeWidth: 1.5,
                                                        stroke: "#333",
                                                    }}
                                                ></Tag>
                                                <div
                                                    className={
                                                        "flex justify-between w-full"
                                                    }
                                                >
                                                    <p>
                                                        {tag.name}{" "}
                                                        <b
                                                            className={
                                                                "text-xs text-muted-foreground inline"
                                                            }
                                                        >
                                                            {tag.count}
                                                        </b>
                                                    </p>
                                                    {inputTags.find(
                                                        (t) =>
                                                            t.name === tag.name
                                                    ) && <Check></Check>}
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
