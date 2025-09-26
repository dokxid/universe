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
import { setTags } from "@/lib/features/map/mapSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Funnel } from "lucide-react";
import React from "react";

export function FilterStoriesDialog() {
    const [open] = React.useState(false);
    const tagState = useAppSelector((state) => state.map.tags);
    const dispatch = useAppDispatch();

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
                    selectedTags={tagState}
                    onTagsChange={(newTags) => dispatch(setTags(newTags))}
                    showLabel={open}
                />
            </DialogContent>
        </Dialog>
    );
}
