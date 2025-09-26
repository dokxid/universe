import { TagPicker } from "@/app/components/form/tag-picker";
import { ControllerRenderProps } from "react-hook-form";

export function TagPickerField(props: ControllerRenderProps) {
    const { value = [], onChange: onChangeAction } = props;

    return <TagPicker selectedTags={value} onTagsChange={onChangeAction} />;
}
