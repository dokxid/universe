"use client";

import { TagPickerFilter } from "@/app/components/selectors/tag-picker";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useAppSelector } from "@/lib/hooks";
import { setSelectedTagsParams } from "@/lib/utils/param-setter";
import { UnescoTagDTOWithCount } from "@/types/dtos";
import { Funnel } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

export function FilterStoriesDialog({
    tagsPromise,
    size = "icon",
}: {
    tagsPromise: Promise<UnescoTagDTOWithCount[]>;
    size?: "icon" | "icon-lg";
}) {
    const tags = React.use(tagsPromise);
    const [open] = React.useState(false);
    const tagState = useAppSelector((state) => state.map.tags);
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const handleTagsChange = (newTags: string[]) => {
        setSelectedTagsParams(pathname, searchParams, newTags);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={"secondary_custom"}
                    className="hover:ring-2"
                    size={size}
                >
                    <Funnel />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <div className="flex flex-col gap-2">
                    <DialogHeader>
                        <DialogTitle>Filter stories</DialogTitle>
                        <DialogDescription>
                            Use the form below to filter stories by tags.
                        </DialogDescription>
                    </DialogHeader>
                    <TagPickerFilter
                        availableTags={tags}
                        selectedTags={tagState}
                        onTagsChange={handleTagsChange}
                        showLabel={open}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
