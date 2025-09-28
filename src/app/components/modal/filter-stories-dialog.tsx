"use client";

import { TagPicker } from "@/app/components/form/tag-picker";
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
import { UnescoTagDTO } from "@/types/api";
import { Funnel } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

export function FilterStoriesDialog({
    tagsPromise,
}: {
    tagsPromise: Promise<UnescoTagDTO[]>;
}) {
    const tags = React.use(tagsPromise);
    const [open] = React.useState(false);
    const tagState = useAppSelector((state) => state.map.tags);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const setSelectedTagsParams = (newTags: string[]) => {
        const search = new URLSearchParams(searchParams);
        if (newTags.length > 0) {
            search.set("tags", newTags.join(","));
        } else {
            search.delete("tags");
        }
        router.push(pathname + "?" + search.toString());
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"secondary"} className="size-10 hover:ring-2">
                    <Funnel />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Filter stories</DialogTitle>
                    <DialogDescription>
                        Use the form below to filter stories by tags.
                    </DialogDescription>
                </DialogHeader>
                <TagPicker
                    availableTags={tags}
                    selectedTags={tagState}
                    onTagsChange={setSelectedTagsParams}
                    showLabel={open}
                />
            </DialogContent>
        </Dialog>
    );
}
