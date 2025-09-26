"use client";

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
import { groupByKey } from "@/lib/utils/group-by-key";
import { UnescoTagDTO } from "@/types/api";
import { PlusIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "../../../components/ui/badge";

// Base component - no form binding
interface TagPickerProps {
    availableTags: UnescoTagDTO[];
    selectedTags?: string[];
    onTagsChange?: (tags: string[]) => void;
    className?: string;
    showLabel?: boolean;
}

export function TagPicker({
    availableTags,
    selectedTags = [],
    onTagsChange,
    className,
    showLabel = true,
}: TagPickerProps) {
    const [inputTags, setInputTags] = useState<UnescoTagDTO[]>([]);
    const [tagPickerOpen, setTagPickerOpen] = useState<boolean>(false);
    const tags = availableTags;

    // sync inputTags with selected tags
    useEffect(() => {
        if (tags && selectedTags) {
            const tagObjects = tags.filter((tag) =>
                selectedTags.includes(tag.name)
            );
            setInputTags(tagObjects);
        }
    }, [tags, selectedTags]);

    const handleMouseEnter = () => {
        setTagPickerOpen(true);
    };

    const handleTagRemove = (tagToRemove: UnescoTagDTO) => {
        const newTags = inputTags.filter((t) => t !== tagToRemove);
        setInputTags(newTags);
        onTagsChange?.(newTags.map((tag) => tag.name));
    };

    const handleTagAdd = (tagToAdd: UnescoTagDTO) => {
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
                <div className={"flex flex-wrap gap-2 mt-1"}>
                    {inputTags.map((tag) => (
                        <Badge
                            key={tag._id}
                            variant={"default"}
                            onClick={() => {
                                handleTagRemove(tag);
                            }}
                            className={
                                "cursor-pointer group hover:text-destructive h-7 hover:hover:bg-accent dark:hover:bg-accent/50"
                            }
                        >
                            <p>{tag.name}</p>
                            <X />
                        </Badge>
                    ))}
                    <PopoverTrigger asChild>
                        <Badge
                            onClick={handleMouseEnter}
                            variant={"default"}
                            className={
                                (tagPickerOpen
                                    ? "bg-primary-foreground text-primary"
                                    : "bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground") +
                                " h-7 cursor-pointer"
                            }
                        >
                            Add Tag
                            <PlusIcon />
                        </Badge>
                    </PopoverTrigger>
                </div>
                <PopoverContent className="w-80">
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
                                                key={
                                                    tag.theme +
                                                    tag.category +
                                                    tag._id
                                                }
                                                onSelect={() => {
                                                    handleTagAdd(tag);
                                                }}
                                            >
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
