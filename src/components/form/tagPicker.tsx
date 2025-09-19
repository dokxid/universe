import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useTags } from "@/lib/data_hooks/tagsHook";
import { TagData } from "@/types/api";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { PlusIcon, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { ControllerRenderProps } from "react-hook-form";

export function TagPicker({ value = [], onChange }: ControllerRenderProps) {
    const [inputTags, setInputTags] = useState<TagData[]>([]);
    const [tagPickerOpen, setTagPickerOpen] = useState<boolean>(false);
    const { tags, isLoading } = useTags();

    // sync inputTags with form value
    useEffect(() => {
        if (tags && value) {
            const selectedTags = tags.filter((tag) => value.includes(tag.name));
            setInputTags(selectedTags);
        }
    }, [tags, value]);

    const handleMouseEnter = () => {
        setTagPickerOpen(true);
        console.log(tags);
    };

    const handleTagRemove = (tagToRemove: TagData) => {
        const newTags = inputTags.filter((t) => t !== tagToRemove);
        setInputTags(newTags);
        onChange?.(newTags.map((tag) => tag.name));
    };

    const handleTagAdd = (tagToAdd: TagData) => {
        const newTags = [...inputTags, tagToAdd];
        setInputTags(newTags);
        setTagPickerOpen(false);
        onChange?.(newTags.map((tag) => tag.name));
    };

    if (isLoading) return <Spinner />;

    return (
        <div className={"col-span-12 col-start-auto space-y-0 items-start"}>
            <p className={"text-sm font-medium"}>Tags</p>
            <Popover
                open={tagPickerOpen}
                onOpenChange={setTagPickerOpen}
                modal={true}
            >
                <div className={"flex flex-wrap gap-1 mt-1"}>
                    {inputTags.map((tag) => (
                        <Badge
                            key={tag.name + "_input"}
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
                            variant={"outline"}
                            className={
                                (tagPickerOpen
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-primary-foreground text-primary") +
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
                        <CommandInput placeholder="Search tags..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="UNESCO tags">
                                {tags
                                    .filter(
                                        (tag) =>
                                            tag.unesco_tag &&
                                            !inputTags.includes(tag)
                                    )
                                    .map((tag: TagData) => (
                                        <CommandItem
                                            key={tag.name + "_unesco_tag"}
                                            onSelect={() => handleTagAdd(tag)}
                                        >
                                            {tag.name}
                                        </CommandItem>
                                    ))}
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup heading="custom tags">
                                {tags
                                    .filter(
                                        (tag) =>
                                            !tag.unesco_tag &&
                                            !inputTags.includes(tag)
                                    )
                                    .map((tag: TagData) => (
                                        <CommandItem
                                            key={tag.name + "_custom_tag"}
                                            onSelect={() => handleTagAdd(tag)}
                                        >
                                            {tag.name}
                                        </CommandItem>
                                    ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
