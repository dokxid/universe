"use client";

import { editStoryContentAction } from "@/actions/stories";
import {
    SettingsBoxFormElement,
    SettingsFormButtonGroup,
} from "@/app/components/layout/content-layout";
import { DebugListObject } from "@/app/components/views/debug-list-object";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { StoryDTO } from "@/types/dtos";
import { editContentFormSchema } from "@/types/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tiptap/core";
import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function EditorView({ story }: { story: StoryDTO }) {
    const editorRef = useRef<Editor | null>(null);
    const editContentForm = useForm<z.infer<typeof editContentFormSchema>>({
        resolver: zodResolver(editContentFormSchema),
        defaultValues: {
            content: story.content,
        },
    });

    const handleCreate = useCallback(
        ({ editor }: { editor: Editor }) => {
            if (editContentForm.getValues("content") && editor.isEmpty) {
                editor.commands.setContent(
                    editContentForm.getValues("content")
                );
            }
            editorRef.current = editor;
        },
        [editContentForm]
    );

    const onSubmit = async (data: z.output<typeof editContentFormSchema>) => {
        try {
            const formData = new FormData();
            formData.append("storyId", data.storyId);
            formData.append("content", data.content);
            await editStoryContentAction(formData)
                .then(() => {
                    toast.success("Story content updated successfully.");
                })
                .catch((error) => {
                    toast.error("Failed to update story content.");
                    console.error("Error updating story content:", error);
                });
        } catch (error) {
            console.error("Error updating story content:", error);
            toast.error("Failed to update story content.");
        }
    };

    const onReset = () => {
        editContentForm.reset();
        if (editorRef.current) {
            editorRef.current.commands.setContent(
                editContentForm.getValues("content") || ""
            );
        }
    };

    return (
        <>
            <Form {...editContentForm}>
                <form
                    onSubmit={editContentForm.handleSubmit(onSubmit)}
                    onReset={onReset}
                    className="h-full"
                >
                    <FormField
                        name="content"
                        control={editContentForm.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <MinimalTiptapEditor
                                        output="html"
                                        editorContentClassName={
                                            " prose p-5 dark:prose-invert max-w-full overflow-y-auto self-center my-10"
                                        }
                                        className={
                                            "prose-content w-full max-h-[80svh]"
                                        }
                                        onCreate={handleCreate}
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <input
                        type={"hidden"}
                        {...editContentForm.register("storyId")}
                        defaultValue={story._id}
                    />
                    <SettingsBoxFormElement className={"mt-4"}>
                        <SettingsFormButtonGroup>
                            <Button
                                type="submit"
                                variant={"default"}
                                className={"w-fit"}
                            >
                                Apply
                            </Button>
                            <Button
                                type="reset"
                                variant={"ghost"}
                                className={"w-fit"}
                            >
                                Reset
                            </Button>
                        </SettingsFormButtonGroup>
                    </SettingsBoxFormElement>
                </form>
            </Form>
            <DebugListObject data={editContentForm.watch()} />
        </>
    );
}
