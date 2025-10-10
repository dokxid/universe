import { TagPickerForm } from "@/app/components/form/tag-picker";
import { UnescoTagDTO } from "@/types/dtos";
import { use } from "react";
import { ControllerRenderProps } from "react-hook-form";

interface TagPickerProps extends ControllerRenderProps {
    availableTagsPromise?: Promise<UnescoTagDTO[]>;
    availableTags?: UnescoTagDTO[];
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

    let allTags: UnescoTagDTO[] = [];
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
