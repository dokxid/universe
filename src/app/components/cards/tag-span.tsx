"use client";

import { cn } from "@/lib/utils";
import { setSelectedTagsParams } from "@/lib/utils/param-setter";
import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";
import { usePathname, useSearchParams } from "next/navigation";
import React, { ComponentProps } from "react";

export const tagVariants = cva(
    "inline-flex pointer-events-auto items-center justify-center rounded-md w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-colors duration-200 overflow-hidden rounded-none font-bold text-black hover:cursor-pointer group",
    {
        variants: {
            variant: {
                default: "hover:opacity-80",
                add: "hover:bg-green-600! hover:text-white",
                remove: "hover:text-destructive! hover:bg-transparent! after:content-['_✕'] after:ml-1",
            },
            size: {
                default: "text-xs px-2 py-0.5",
                sm: "text-[0.72rem] px-1.5 py-0.5",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export function TagSpan({
    tag,
    color,
    className,
    variant,
    size,
    asChild = false,
    ...props
}: ComponentProps<"span"> &
    VariantProps<typeof tagVariants> & {
        tag: string;
        color?: string;
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot : "span";
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentTags = searchParams.get("tags")?.split(",") || [];

    function setTagToUrl(event: React.MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        if (currentTags.includes(tag)) {
            return;
        }
        const newTags = [...currentTags, tag];
        setSelectedTagsParams(pathname, searchParams, newTags);
    }

    function removeTagFromUrl(event: React.MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        const newTags = currentTags.filter((t) => t !== tag);
        setSelectedTagsParams(pathname, searchParams, newTags);
    }

    return (
        <Comp
            onClick={variant === "add" ? setTagToUrl : removeTagFromUrl}
            style={{
                backgroundColor: color ?? "#777",
            }}
            className={cn(tagVariants({ variant, size }), className)}
            {...props}
        >
            {tag}
        </Comp>
    );
}
