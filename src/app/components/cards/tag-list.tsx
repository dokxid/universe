"use client";

import { TagSpan, tagVariants } from "@/app/components/cards/tag-span";
import { cn } from "@/lib/utils";
import { TagDTO } from "@/types/dtos";
import { VariantProps } from "class-variance-authority";

export function TagList({
    tags,
    className,
    variant = "default",
    size = "default",
}: {
    tags: TagDTO[];
    className?: string;
    variant?: VariantProps<typeof tagVariants>["variant"];
    size?: VariantProps<typeof tagVariants>["size"];
}) {
    return (
        <div
            data-slot={"tag-list"}
            className={cn(
                "flex flex-wrap gap-1.5 my-3 pointer-events-none",
                className
            )}
        >
            {tags.map((tag: TagDTO) => (
                <TagSpan
                    key={tag.id}
                    tag={tag.name}
                    variant={variant}
                    color={tag.color}
                    size={size}
                />
            ))}
        </div>
    );
}
