import { TagSpan, tagVariants } from "@/app/components/cards/tag-span";
import { useTags } from "@/lib/data_hooks/tag-hook";
import { cn } from "@/lib/utils";
import { UnescoTagDTO } from "@/types/dtos";
import { VariantProps } from "class-variance-authority";

export function TagList({
    tags,
    className,
    variant = "default",
}: {
    tags: string[];
    className?: string;
    variant?: VariantProps<typeof tagVariants>["variant"];
}) {
    const { tags: tagsSanitized, isLoading, isError } = useTags();
    if (isLoading || isError) {
        return (
            <div
                data-slot={"tag-list"}
                className={cn("flex-wrap space-x-1 space-y-1", className)}
            >
                {tags.map((tag) => (
                    <TagSpan
                        key={tag}
                        tag={tag}
                        variant={variant}
                        color={"#333"}
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
            className={cn("flex-wrap space-x-1 space-y-1 my-3", className)}
        >
            {tagsToBeRendered.map((tag: UnescoTagDTO) => (
                <TagSpan
                    key={tag._id}
                    tag={tag.name}
                    variant={variant}
                    color={tag.color}
                />
            ))}
        </div>
    );
}
