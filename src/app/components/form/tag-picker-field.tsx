import { TagPicker } from "@/app/components/form/tag-picker";
import { UnescoTagDTO } from "@/types/api";
import { use } from "react";
import { ControllerRenderProps } from "react-hook-form";

interface TagPickerProps extends ControllerRenderProps {
    availableTagsPromise: Promise<UnescoTagDTO[]>;
}

export function TagPickerField(props: TagPickerProps) {
    const {
        value = [],
        onChange: onChangeAction,
        availableTagsPromise,
    } = props;
    const availableTags = use(availableTagsPromise);

    return (
        <TagPicker
            selectedTags={value}
            onTagsChange={onChangeAction}
            availableTags={availableTags}
        />
    );
}
