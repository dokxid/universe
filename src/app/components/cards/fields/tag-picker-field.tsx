import { TagPickerForm } from "@/app/components/selectors/tag-picker";
import { TagDTO } from "@/types/dtos";
import { use } from "react";
import { ControllerRenderProps } from "react-hook-form";

interface TagPickerProps extends ControllerRenderProps {
    availableTagsPromise?: Promise<TagDTO[]>;
    availableTags?: TagDTO[];
}

export function TagPickerField(props: TagPickerProps) {
    const {
        value = [],
        onChange: onChangeAction,
        availableTagsPromise,
        availableTags,
    } = props;
    if (!availableTagsPromise && !availableTags) {
        throw new Error(
            "TagPickerField requires either availableTagsPromise or availableTags prop"
        );
    }

    let allTags: TagDTO[] = [];
    if (availableTags) {
        allTags = availableTags;
    } else if (availableTagsPromise) {
        allTags = use(availableTagsPromise);
    }

    return (
        <TagPickerForm
            selectedTags={value}
            onTagsChange={onChangeAction}
            availableTags={allTags}
        />
    );
}
