"use client";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import React from "react";
import {TagPicker} from "@/components/form/tagPicker";
import {TiptapEditor} from "@/components/form/tiptapEditor";
import {toast} from "sonner";
import {setAddStoryDialogOpen} from "@/lib/features/dialogue/addStoryDialogSlice";


export default function AddStoryForm() {

    const addStoryDialogue = useAppSelector(state => state.addStoryDialog)
    const dispatch = useAppDispatch()

    const formSchema = z.object({
        title: z.string().min(1, {message: "This field is required"}),
        content: z.string().min(1, {message: "This field is required"}),
        year: z.string().refine(value => value.length <= 4, {message: "Year must be 4 or less digits"}),
        featuredImage: z.string(),
        longitude: z.number().refine(value => value >= -180 && value <= 180, {}),
        latitude: z.number().refine(value => value >= -90 && value <= 90, {}),
        tags: z.array(z.string()),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            content: "",
            year: "",
            featuredImage: "",
            longitude: addStoryDialogue.longitude,
            latitude: addStoryDialogue.latitude,
            tags: [],
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        fetch("/api/stories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        }).then(() => {
                toast.success("Story added successfully!")
                dispatch(setAddStoryDialogOpen())
            },
            () => toast.error("Failed to add story. Please try again later."))
    }

    function onReset() {
        form.reset();
        form.clearErrors();
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                onReset={onReset}
                className="space-y-8 @container overflow-y-auto max-h-[calc(100vh-10rem)]"
            >
                <div className="grid grid-cols-12 gap-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({field}) => (
                            <FormItem
                                className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="flex shrink-0">Story title</FormLabel>

                                <div className="w-full">
                                    <FormControl>
                                        <div className="relative w-full">
                                            <Input
                                                key="title"
                                                placeholder=""
                                                type="text"
                                                id="title"
                                                className=" "
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>

                                    <FormMessage/>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="content"
                        render={({field}) => (
                            <FormItem
                                className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="flex shrink-0">Description</FormLabel>

                                <FormControl>
                                    <div className={"w-full h-100"}>
                                        <TiptapEditor key={"content"} id={"content"}
                                                      placeholder={""} {...field}></TiptapEditor>
                                    </div>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="year"
                        render={({field}) => (
                            <FormItem
                                className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="flex shrink-0">Year</FormLabel>

                                <div className="w-full">
                                    <FormControl>
                                        <div className="relative w-full">
                                            <Input
                                                key="year"
                                                placeholder=""
                                                type="tel"
                                                id="year"
                                                className=" "
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>

                                    <FormMessage/>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="featured-image"
                        render={({field}) => (
                            <FormItem
                                className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="flex shrink-0">
                                    Featured picture
                                </FormLabel>

                                <div className="w-full">
                                    <FormControl>
                                        <div className="relative w-full">
                                            <Input
                                                key="featured-image"
                                                placeholder=""
                                                type="file"
                                                id="featured-image"
                                                className=" "
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>

                                    <FormMessage/>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="longitude"
                        render={({field}) => (
                            <FormItem
                                className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="flex shrink-0">Longitude</FormLabel>

                                <div className="w-full">
                                    <FormControl>
                                        <div className="relative w-full">
                                            <Input
                                                key="longitude"
                                                placeholder=""
                                                type="number"
                                                id="longitude"
                                                className=" "
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>

                                    <FormMessage/>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="latitude"
                        render={({field}) => (
                            <FormItem
                                className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="flex shrink-0">Lattitude</FormLabel>

                                <div className="w-full">
                                    <FormControl>
                                        <div className="relative w-full">
                                            <Input
                                                key="latitude"
                                                placeholder=""
                                                type="number"
                                                id="latitude"
                                                className=" "
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>

                                    <FormMessage/>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField render={({field}) => (
                        <FormItem
                            className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                            <FormControl>
                                <TagPicker {...field}></TagPicker>
                            </FormControl>
                        </FormItem>
                    )} name={"tags"}></FormField>
                    <div className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                        <Button type="submit" variant="default" className={"w-full"}>Submit</Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}
