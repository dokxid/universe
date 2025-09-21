"use client";

import { submitStory } from "@/actions/submitStory";
import { TagPicker } from "@/app/components/form/tag-picker";
import { TiptapEditor } from "@/app/components/form/tiptap-editor";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { submitStoryFormSchema } from "@/types/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function AddStoryForm() {
    const { user } = useAuth();
    const addStoryDialogue = useAppSelector((state) => state.addStoryDialog);
    const experiencesState = useAppSelector((state) => state.experiences);
    const dispatch = useAppDispatch();

    const [featuredImage, setFeaturedImage] = React.useState<File | null>(null);

    const form = useForm<z.infer<typeof submitStoryFormSchema>>({
        resolver: zodResolver(submitStoryFormSchema),
        defaultValues: {
            title: "",
            content: "",
            year: new Date().getFullYear(),
            longitude: addStoryDialogue.longitude,
            latitude: addStoryDialogue.latitude,
            tags: [],
            author: user?.id || "unknown",
            draft: true,
            // experience: experiencesState.currentExperience,
            experience: "test",
        },
    });

    function onSubmit(values: z.output<typeof submitStoryFormSchema>) {
        try {
            if (!featuredImage) {
                toast.error("Please select a featured image.");
                return;
            }
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("content", values.content);
            formData.append("year", values.year.toString());
            formData.append("longitude", values.longitude.toFixed(4));
            formData.append("latitude", values.latitude.toFixed(4));
            formData.append("tags", JSON.stringify(values.tags));
            formData.append("author", values.author);
            formData.append("experience", values.experience);
            formData.append("draft", values.draft.toString());
            formData.append("file", featuredImage as File);
            console.log("FormData entries:");
            for (const [key, value] of formData.entries()) {
                console.log(key, value); // Debugging log
            }
            submitStory(formData, user).then(
                () => {
                    toast.success("Story added successfully!");
                },
                () =>
                    toast.error("Failed to add story. Please try again later.")
            );
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error(
                "An unexpected error occurred. Please try again later."
            );
        }
    }

    function onReset() {
        form.reset();
        form.clearErrors();
    }

    // Add a handler for file input change
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setFeaturedImage(file);
        console.log("Selected file:", file);
    };

    return (
        <div className={"w-full overflow-auto"}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit, (e) => {
                        console.log("errors", e);
                    })}
                    onReset={onReset}
                    className="space-y-8 @container"
                >
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="flex shrink-0">
                                    Story title
                                </FormLabel>

                                <div className="w-full">
                                    <FormControl>
                                        <div className="relative w-full">
                                            <Input
                                                placeholder="Enter your title..."
                                                type="text"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>

                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="flex shrink-0">
                                    Description
                                </FormLabel>

                                <FormControl>
                                    <div className={"w-full h-100"}>
                                        <TiptapEditor
                                            {...field}
                                            onChange={field.onChange}
                                        ></TiptapEditor>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                            <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="flex shrink-0">
                                    Year
                                </FormLabel>

                                <div className="w-full">
                                    <FormControl>
                                        <div className="relative w-full">
                                            <Input
                                                placeholder="Enter the stories year..."
                                                type="number"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>

                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="featuredImage"
                        render={() => (
                            <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="flex shrink-0">
                                    Featured picture
                                </FormLabel>
                                <div className="w-full">
                                    <FormControl>
                                        <div className="relative w-full">
                                            <Input
                                                type="file"
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormControl>
                                    <TagPicker {...field}></TagPicker>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="longitude"
                        render={({ field }) => (
                            <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="flex shrink-0">
                                    Longitude
                                </FormLabel>

                                <div className="w-full">
                                    <FormControl>
                                        <div className="relative w-full">
                                            <Input type="number" {...field} />
                                        </div>
                                    </FormControl>

                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="latitude"
                        render={({ field }) => (
                            <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="flex shrink-0">
                                    Latitude
                                </FormLabel>

                                <div className="w-full">
                                    <FormControl>
                                        <div className="relative w-full">
                                            <Input type="number" {...field} />
                                        </div>
                                    </FormControl>

                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="draft"
                        render={({ field }) => (
                            <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <div className="w-full">
                                    <FormControl>
                                        <div className="relative w-full">
                                            <div className="flex items-center gap-3">
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                                <Label htmlFor="terms">
                                                    Is this a draft?
                                                </Label>
                                            </div>
                                        </div>
                                    </FormControl>

                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                            <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="flex shrink-0">
                                    in experience:
                                </FormLabel>

                                <div className="w-full">
                                    <FormControl>
                                        <div className="relative w-full">
                                            <Input
                                                placeholder=""
                                                type="text"
                                                disabled={true}
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>

                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <div className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                        <Button
                            type="submit"
                            variant="default"
                            className={"w-full cursor-pointer"}
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
