"use client";

import { CCLicensesFormField } from "@/app/components/form/cc-licenses-form-field";
import { CoordinatesFormField } from "@/app/components/form/coordinates-form-field";
import { FeaturedPictureFormField } from "@/app/components/form/featured-picture-form-field";
import { TagPickerField } from "@/app/components/form/tag-picker-field";
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
import EditorView from "@/app/components/stories/editor-view";
import { DebugListObject } from "@/app/components/views/debug-list-object";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Toggle } from "@/components/ui/toggle";
import { StoryDTO, UnescoTagDTO } from "@/types/dtos";
import { editStoryFormSchema } from "@/types/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export default function StoryEdit({
    story,
    allTags,
}: {
    story: StoryDTO;
    allTags: UnescoTagDTO[];
}) {
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    const editStoryForm = useForm<z.infer<typeof editStoryFormSchema>>({
        resolver: zodResolver(editStoryFormSchema),
        defaultValues: {
            title: story.title,
            featured_image_url: story.featured_image_url,
            tags: story.tags,
            draft: story.draft,
            year: story.year,
        },
    });

    const onSubmit = (data: z.output<typeof editStoryFormSchema>) => {
        console.log(data);
    };
    const onReset = () => {
        editStoryForm.reset();
    };
    return (
        <ContentLayout>
            {/* <div className={"w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 mb-8"}>
                <StoryImage imageUrl={story.featured_image_url} />
            </div> */}
            <Header separatorVisible={false} className={"mb-6"}>
                <div className={"flex flex-col gap-3 w-full"}>
                    <Form {...editStoryForm}>
                        <form
                            onSubmit={editStoryForm.handleSubmit(onSubmit)}
                            onReset={onReset}
                            className="w-full"
                        >
                            <div className={"max-w-lg"}>
                                <FormField
                                    control={editStoryForm.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <TagPickerField
                                            availableTags={allTags}
                                            {...field}
                                        />
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
                                                                        e
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
                                                                            e
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
                                        href={`/${story.experience}/stories/view/${story._id}`}
                                    >
                                        <Button variant={"secondary_custom"}>
                                            Back to view
                                        </Button>
                                    </Link>
                                    <Toggle
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
                    <EditorView story={story} isPreviewMode={isPreviewMode} />
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
