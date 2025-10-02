"use client";

import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { StoryDTO } from "@/types/dtos";
import { useState } from "react";

export default function EditorView({
    storySerialized,
}: {
    storySerialized: string;
}) {
    const story = JSON.parse(storySerialized) as StoryDTO;
    const [content] = useState(story.content);
    return (
        <div className="h-[75svh]">
            <MinimalTiptapEditor
                content={content}
                output="html"
                editorContentClassName={
                    " prose p-5 dark:prose-invert max-w-full max-w-[70svh] overflow-y-auto self-center my-10"
                }
                className={"prose-content w-full h-full"}
            ></MinimalTiptapEditor>
        </div>
    );
}
