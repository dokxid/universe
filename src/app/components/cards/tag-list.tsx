"use client";

import { TagSpan, tagVariants } from "@/app/components/cards/tag-span";
import { useTags } from "@/lib/data_hooks/tag-hook";
import { cn } from "@/lib/utils";
import { UnescoTagDTO } from "@/types/dtos";
import { VariantProps } from "class-variance-authority";

export function TagList({
    tags,
    className,
    variant = "default",
    size = "default",
}: {
    tags: string[];
    className?: string;
    variant?: VariantProps<typeof tagVariants>["variant"];
    size?: VariantProps<typeof tagVariants>["size"];
}) {
    const { tags: tagsSanitized, isLoading, isError } = useTags();
    if (isLoading || isError) {
        return (
            <div
                data-slot={"tag-list"}
                className={cn("flex flex-wrap gap-2 my-3", className)}
            >
                {tags.map((tag) => (
                    <TagSpan
                        key={tag}
                        tag={tag}
                        variant={variant}
                        color={"#333"}
                        size={size}
                    />
                ))}
            </div>
        );
    }
    if (!tagsSanitized) {
        return <div>Error loading tags</div>;
    }
    const tagsToBeRendered = tagsSanitized.filter((tag) =>
        tags.includes(tag.name)
    );
    return (
        <div
            data-slot={"tag-list"}
            className={cn(
                "flex flex-wrap gap-1.5 my-3 pointer-events-none",
                className
            )}
        >
            {tagsToBeRendered.map((tag: UnescoTagDTO) => (
                <TagSpan
                    key={tag._id}
                    tag={tag.name}
                    variant={variant}
                    color={tag.color}
                    size={size}
                />
            ))}
        </div>
    );
}
