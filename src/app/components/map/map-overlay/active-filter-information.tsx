"use client";

import { TagList } from "@/app/components/cards/tag-list";
import { useSearchParams } from "next/navigation";

export function ActiveFilterInformation() {
    const searchParams = useSearchParams();
    const selectedFilterTags = searchParams.get("tags")?.split(",") || [];
    if (!selectedFilterTags || selectedFilterTags.length === 0) {
        return null;
    }
    return (
        <div className={"self-start w-fit h-fit pointer-events-auto"}>
            {selectedFilterTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <TagList tags={selectedFilterTags} variant={"remove"} />
                </div>
            )}
        </div>
    );
}
