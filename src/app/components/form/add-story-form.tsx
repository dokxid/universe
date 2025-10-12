"use client";

import { submitStoryAction } from "@/actions/stories";
import { TagPickerField } from "@/app/components/form/tag-picker-field";
import { TiptapEditor } from "@/app/components/form/tiptap-editor";
import { SettingsBoxFormElement } from "@/app/components/layout/content-layout";
import { DebugListObject } from "@/app/components/views/debug-list-object";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CC_LICENSES, UnescoTagDTO } from "@/types/dtos";
import { submitStoryFormSchema } from "@/types/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function AddStoryForm({
    slug,
    tagsPromise,
}: {
    slug: string;
    tagsPromise: Promise<UnescoTagDTO[]>;
}) {
    useAuth({ ensureSignedIn: true });
    const router = useRouter();
    const searchParams = useSearchParams();
    const lng = searchParams.get("lng");
    const lat = searchParams.get("lat");

    const form = useForm({
        resolver: zodResolver(submitStoryFormSchema),
        defaultValues: {
            title: "",
            content: "",
            year: new Date().getFullYear(),
            longitude: lng,
            latitude: lat,
            tags: [],
            universe: false,
            draft: true,
            license: "CC0",
            slug: slug,
            featuredPicture: undefined,
        },
    });

    async function onSubmit(values: z.output<typeof submitStoryFormSchema>) {
        console.log("Submitting form with values:", values);
        try {
            toast.info("Submitting story...");
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("content", values.content);
            formData.append("year", values.year.toString());
            formData.append("longitude", values.longitude.toFixed(6));
            formData.append("latitude", values.latitude.toFixed(6));
            formData.append("tags", JSON.stringify(values.tags));
            formData.append("slug", slug);
            formData.append("license", values.license);
            formData.append("draft", values.draft.toString());
            formData.append("universe", values.universe.toString());
            formData.append("featuredPicture", values.featuredPicture as File);

            const result = await submitStoryAction(formData);
            if (result?.success) {
                toast.success("Story updated successfully!");
                router.push(`/${slug}/stories/view/${result.storyId}`);
            }
            if (result?.error) {
                const zodErrors = JSON.parse(result.error);
                Object.keys(zodErrors.fieldErrors).forEach((fieldName) => {
                    form.setError(
                        fieldName as keyof z.input<
                            typeof submitStoryFormSchema
                        >,
                        {
                            type: "server",
                            message:
                                zodErrors.fieldErrors[fieldName].join(", "),
                        }
                    );
                });
                zodErrors.formErrors.forEach((error: string) => {
                    toast.error(error);
                });
            }
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

    return (
        <div className={"max-w-xl overflow-auto"}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
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
                                    <div className={"w-full"}>
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
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseFloat(
                                                            e.target.value
                                                        )
                                                    )
                                                }
                                            />
                                        </div>
                                    </FormControl>

                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="featuredPicture"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="flex shrink-0">
                                    Featured picture
                                </FormLabel>
                                <div className="w-full">
                                    <FormControl>
                                        <div className="relative w-full">
                                            <Input
                                                type="file"
                                                onChange={(e) => {
                                                    const file =
                                                        e.target.files?.[0] ||
                                                        null;
                                                    if (!file) {
                                                        return;
                                                    }
                                                    // update RHF with the actual File object
                                                    field.onChange(file);
                                                    form.setValue(
                                                        "featuredPicture",
                                                        file
                                                    );
                                                    // run validation right away
                                                    form.trigger(
                                                        "featuredPicture"
                                                    );
                                                }}
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
                                    <TagPickerField
                                        availableTagsPromise={tagsPromise}
                                        {...field}
                                    />
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
                                            <Input
                                                type="number"
                                                {...field}
                                                value={field.value as number}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseFloat(
                                                            e.target.value
                                                        )
                                                    )
                                                }
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
                        name="latitude"
                        render={({ field }) => (
                            <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="flex shrink-0">
                                    Latitude
                                </FormLabel>

                                <div className="w-full">
                                    <FormControl>
                                        <div className="relative w-full">
                                            <Input
                                                type="number"
                                                {...field}
                                                value={field.value as number}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseFloat(
                                                            e.target.value
                                                        )
                                                    )
                                                }
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
                        name="slug"
                        render={({ field }) => (
                            <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="flex shrink-0">
                                    Heritage Lab Slug
                                </FormLabel>

                                <div className="w-full">
                                    <FormControl>
                                        <div className="relative w-full">
                                            <Input
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
                    <SettingsBoxFormElement>
                        <Label>License</Label>
                        <FormField
                            control={form.control}
                            name="license"
                            render={({ field }) => (
                                <FormItem className={"mt-2"}>
                                    <FormControl>
                                        <RadioGroup
                                            {...field}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            {Object.entries(CC_LICENSES).map(
                                                ([value, label]) => (
                                                    <div
                                                        key={value}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <RadioGroupItem
                                                            value={value}
                                                            id={value}
                                                        />
                                                        <Label htmlFor={value}>
                                                            {`${label.code} - ${label.name}`}
                                                        </Label>
                                                    </div>
                                                )
                                            )}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                    <FormDescription>
                                        For more information about this specific
                                        license, visit:{" "}
                                        <Link
                                            href={
                                                CC_LICENSES[
                                                    field.value as keyof typeof CC_LICENSES
                                                ].url
                                            }
                                            target="_blank"
                                            className={
                                                "link-external inline-block"
                                            }
                                        >
                                            {
                                                CC_LICENSES[
                                                    field.value as keyof typeof CC_LICENSES
                                                ].url
                                            }
                                        </Link>
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                    </SettingsBoxFormElement>
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
                        name="universe"
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
                                                    Immediately request
                                                    elevation for /universe
                                                </Label>
                                            </div>
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
                        <DebugListObject data={form.watch()} />
                    </div>
                </form>
            </Form>
        </div>
    );
}
