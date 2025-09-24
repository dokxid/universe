import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useTags } from "@/lib/data_hooks/tagsHook";
import { Tag } from "@/types/api";
import { PlusIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { Badge } from "../../../components/ui/badge";

// Base component - no form binding
interface TagPickerProps {
    selectedTags?: string[];
    onTagsChange?: (tags: string[]) => void;
    className?: string;
    showLabel?: boolean;
}

export function TagPicker({
    selectedTags = [],
    onTagsChange,
    className,
    showLabel = true,
}: TagPickerProps) {
    const [inputTags, setInputTags] = useState<Tag[]>([]);
    const [tagPickerOpen, setTagPickerOpen] = useState<boolean>(false);
    const { tags, isLoading } = useTags();

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

    const handleTagRemove = (tagToRemove: Tag) => {
        const newTags = inputTags.filter((t) => t !== tagToRemove);
        setInputTags(newTags);
        onTagsChange?.(newTags.map((tag) => tag.name));
    };

    const handleTagAdd = (tagToAdd: Tag) => {
        const newTags = [...inputTags, tagToAdd];
        setInputTags(newTags);
        setTagPickerOpen(false);
        onTagsChange?.(newTags.map((tag) => tag.name));
    };

    if (isLoading) return <Spinner />;

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
                                    .map((tag: Tag) => (
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
                                    .map((tag: Tag) => (
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

// Form-bound component
export function TagPickerField(props: ControllerRenderProps) {
    const { value = [], onChange } = props;

    return <TagPicker selectedTags={value} onTagsChange={onChange} />;
}
