"use client";

import { Badge } from "@/components/ui/badge";
import { setSelectedTagsParams } from "@/lib/utils/param-setter";
import { X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

export function TagSpan({
    tag,
    color,
    variant,
}: {
    tag: string;
    color?: string;
    variant?: "add" | "remove";
}) {
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
        <Badge
            onClick={variant === "add" ? setTagToUrl : removeTagFromUrl}
            style={{
                backgroundColor: color ?? "#777",
            }}
            variant={"tag"}
            key={tag}
            className={"group/tag-span"}
        >
            {tag}
            {variant === "remove" && (
                <X
                    className={"stroke-3 group-hover/tag-span:text-destructive"}
                />
            )}
        </Badge>
    );
}
