"use client";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { StoryDTO } from "@/types/dtos";
import { editContentFormSchema } from "@/types/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

export default function EditorView({
    story,
    isPreviewMode,
}: {
    story: StoryDTO;
    isPreviewMode: boolean;
}) {
    const editContentForm = useForm<z.infer<typeof editContentFormSchema>>({
        resolver: zodResolver(editContentFormSchema),
        defaultValues: {
            content: story.content,
        },
    });
    console.log("Rendering EditorView with isPreviewMode:", isPreviewMode);
    return (
        <Form {...editContentForm}>
            <form
                onSubmit={editContentForm.handleSubmit(() => {})}
                className="h-full"
            >
                <FormField
                    name="content"
                    control={editContentForm.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <MinimalTiptapEditor
                                    content={field.value}
                                    output="html"
                                    editorContentClassName={
                                        " prose p-5 dark:prose-invert max-w-full overflow-y-auto self-center my-10"
                                    }
                                    className={
                                        "prose-content w-full max-h-[80svh]"
                                    }
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}
