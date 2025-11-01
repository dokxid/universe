"use client";

import { TagList } from "@/app/components/cards/tag-list";
import { useTags } from "@/lib/swr/tag-hook";
import { setSelectedTagsParams } from "@/lib/utils/param-setter";
import { convertTagNamesToTagDTOs } from "@/lib/utils/tags";
import { X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

export function ActiveFilterInformation() {
    const { tags, isLoading, isError } = useTags();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const selectedFilterTags = searchParams.get("tags")?.split(",");
    if (!selectedFilterTags || selectedFilterTags.length === 0) {
        return null;
    }
    if (isLoading || isError || !tags) {
        return null;
    }
    return (
        <div
            className={
                "flex flex-col gap-0 pointer-events-auto px-0 py-4 bg-transparent rounded-md text-background min-w-[100px] w-full max-w-sm"
            }
        >
            <div
                className={
                    "flex flex-row -mb-2 items-stretch gap-1 bg-secondary w-fit"
                }
            >
                <h4
                    className={
                        "text-sm font-semibold text-secondary-foreground px-2 py-1 w-fit"
                    }
                >
                    Applied Filters:
                </h4>
                <p
                    onClick={() =>
                        setSelectedTagsParams(pathname, searchParams, [])
                    }
                    className={
                        "w-fit text-[11px] px-2 py-1 flex items-center gap-1 text-muted-foreground hover:text-destructive hover:cursor-pointer hover:font-semibold hover:bg-accent transition-all duration-200"
                    }
                >
                    <X className={"size-3 -mr-0.5"} />
                    Clear Filters
                </p>
            </div>
            <TagList
                tags={convertTagNamesToTagDTOs(tags, selectedFilterTags)}
                variant={"remove"}
            />
        </div>
    );
}
