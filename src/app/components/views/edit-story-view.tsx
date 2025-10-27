"use client";

import { editStoryFormAction } from "@/actions/form/stories";
import { DebugListObject } from "@/app/components/cards/debug-list-object";
import { TagPickerField } from "@/app/components/cards/fields/tag-picker-field";
import { HostedImage } from "@/app/components/embeds/s3-image";
import { CCLicensesFormField } from "@/app/components/form/story-forms/cc-licenses-form";
import { CoordinatesFormField } from "@/app/components/form/story-forms/coordinates-form";
import { FeaturedPictureFormField } from "@/app/components/form/story-forms/featured-picture-form";
import EditorView from "@/app/components/form/story-forms/story-text-editor-form";
import {
    ContentLayout,
    ContentLayoutInner,
    SettingsFormButtonGroup,
    SettingsLayout,
} from "@/app/components/layout/content-layout";
import {
    Header,
    HeaderContent,
    HeaderDescription,
    HeaderTitle,
} from "@/app/components/layout/header";
import { StoryAuthorEditDetails } from "@/app/components/layout/story-author-details";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Toggle } from "@/components/ui/toggle";
import { StoryDTO, TagDTO } from "@/types/dtos";
import { editStoryFormSchema } from "@/types/form-schemas/story-form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function StoryEdit({
    story,
    allTags,
}: {
    story: StoryDTO;
    allTags: TagDTO[];
}) {
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    const editStoryForm = useForm<z.infer<typeof editStoryFormSchema>>({
        resolver: zodResolver(editStoryFormSchema),
        defaultValues: {
            title: story.title,
            tags: story.tags.map((tag) => tag.name),
            year: story.year,
        },
    });

    const onSubmit = async (data: z.output<typeof editStoryFormSchema>) => {
        try {
            const formData = new FormData();
            formData.append("storyId", data.storyId);
            formData.append("title", data.title);
            formData.append("year", data.year.toString());
            formData.append("tags", JSON.stringify(data.tags));
            const result = await editStoryFormAction(formData);
            if (result?.success) {
                toast.success("Story updated successfully!");
            }
            if (result?.error) {
                const zodErrors = JSON.parse(result.error);
                Object.entries(
                    (zodErrors.fieldErrors + zodErrors.formErrors) as Record<
                        string,
                        string[]
                    >,
                ).forEach(([field, messages]) => {
                    if (field in editStoryForm.getValues()) {
                        editStoryForm.setError(
                            field as keyof z.infer<typeof editStoryFormSchema>,
                            {
                                type: "server",
                                message: messages.join(", "),
                            },
                        );
                    }
                    toast.error(field + ": " + JSON.stringify(messages));
                });
            }
        } catch (error) {
            console.error("Error updating story content:", error);
            toast.error("Failed to update story content.");
        }
    };
    const onReset = () => {
        editStoryForm.reset();
    };
    return (
        <ContentLayout>
            <div className={"w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 mb-8"}>
                <HostedImage
                    fileName={story.featuredImageUrl}
                    alt={story.title}
                />
            </div>
            <Header separatorVisible={false} className={"mb-6"}>
                <div className={"flex flex-col gap-3 w-full"}>
                    <Form {...editStoryForm}>
                        <form
                            onSubmit={editStoryForm.handleSubmit(onSubmit)}
                            onReset={onReset}
                            className="w-full"
                        >
                            <div className={"max-w-lg"}>
                                <input
                                    type={"hidden"}
                                    {...editStoryForm.register("storyId")}
                                    defaultValue={story.id}
                                />
                                <FormField
                                    control={editStoryForm.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <>
                                            <FormControl>
                                                <TagPickerField
                                                    availableTags={allTags}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className={"w-full"} />
                                        </>
                                    )}
                                />
                            </div>
                            <div
                                className={
                                    "flex flex-row justify-between w-full"
                                }
                            >
                                <HeaderContent
                                    className={"flex flex-col items-stretch"}
                                >
                                    <HeaderTitle>
                                        <FormField
                                            control={editStoryForm.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="flex flex-row items-center bg-accent w-full">
                                                        <FormControl>
                                                            <div
                                                                className="grow-wrap w-full"
                                                                data-replicated-value={
                                                                    field.value
                                                                }
                                                            >
                                                                <textarea
                                                                    rows={1}
                                                                    className={
                                                                        "text-3xl font-bold resize-none grow-0 outline-none"
                                                                    }
                                                                    placeholder={
                                                                        "Enter title here..."
                                                                    }
                                                                    onInput={(
                                                                        e,
                                                                    ) => {
                                                                        const target =
                                                                            e.target as HTMLTextAreaElement;
                                                                        const parent =
                                                                            target.parentNode as HTMLElement;
                                                                        if (
                                                                            parent
                                                                        ) {
                                                                            parent.dataset.replicatedValue =
                                                                                target.value;
                                                                        }
                                                                        field.onChange(
                                                                            e,
                                                                        );
                                                                    }}
                                                                    {...field}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </HeaderTitle>
                                    <HeaderDescription>
                                        <StoryAuthorEditDetails
                                            form={editStoryForm}
                                            story={story}
                                            sticky={false}
                                        />
                                    </HeaderDescription>
                                    <DebugListObject
                                        data={editStoryForm.watch()}
                                    />
                                </HeaderContent>
                                <SettingsFormButtonGroup
                                    className={"h-full self-start"}
                                >
                                    <Link
                                        href={`/${story.lab.slug}/stories/view/${story.id}`}
                                    >
                                        <Button
                                            type={"button"}
                                            variant={"secondary_custom"}
                                        >
                                            Back to view
                                        </Button>
                                    </Link>
                                    <Toggle
                                        disabled={true}
                                        type={"button"}
                                        pressed={isPreviewMode}
                                        onPressedChange={setIsPreviewMode}
                                        variant={"primary_custom"}
                                    >
                                        {isPreviewMode
                                            ? "Preview: On"
                                            : "Preview: Off"}
                                    </Toggle>
                                </SettingsFormButtonGroup>
                            </div>
                        </form>
                    </Form>
                </div>
            </Header>
            <ContentLayoutInner>
                <div className={"snap-center"}>
                    <EditorView story={story} />
                </div>
                <SettingsLayout className={"snap-center"}>
                    <CCLicensesFormField story={story} />
                    <CoordinatesFormField story={story} />
                    <FeaturedPictureFormField story={story} />
                </SettingsLayout>
                <SettingsLayout className={""}></SettingsLayout>
            </ContentLayoutInner>
        </ContentLayout>
    );
}
