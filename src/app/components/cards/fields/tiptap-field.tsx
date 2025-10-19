import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { Content } from "@tiptap/react";
import { useEffect, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";

export const TiptapEditor = ({ value, onChange }: ControllerRenderProps) => {
    const [textInput, setTextInput] = useState<Content>(value);

    useEffect(() => {
        setTextInput(value);
    }, [value]);

    const handleEditorChange = (content: Content) => {
        setTextInput(content);
        onChange(content);
    };

    return (
        <MinimalTiptapEditor
            value={textInput}
            onChange={handleEditorChange}
            className="w-full"
            editorContentClassName="p-5"
            output="html"
            placeholder="Enter your description..."
            autofocus={false}
            editable={true}
            editorClassName="focus:outline-hidden"
        />
    );
};
