"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Experience } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters."),
    subtitle: z.string().min(2, "Subtitle must be at least 2 characters."),
    description: z
        .string()
        .min(10, "Description must be at least 10 characters."),
    subdomain: z
        .string()
        .min(3, "Subdomain must be at least 3 characters.")
        .regex(
            /^[a-zA-Z0-9-]+$/,
            "Subdomain can only contain letters, numbers, and hyphens."
        ),
    "featured-picture": z
        .any()
        .refine((files) => files?.length === 1, "Please upload a file.")
        .refine((files) => files?.[0]?.size <= 5000000, "Max file size is 5MB.")
        .refine(
            (files) =>
                files.type === "image/jpeg" || files.type === "image/png",
            "Only .jpg, .png, and .webp files are accepted."
        ),
});

export function TeamSettingsDialog({
    slug,
    experienceSerialized,
}: {
    slug: string;
    experienceSerialized: string;
}) {
    const experience = JSON.parse(experienceSerialized) as Experience;
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: experience.title || "",
            subtitle: experience.subtitle || "",
            description: experience.description || "",
            subdomain: slug,
        },
    });

    const onSubmit = (data: FieldValues) => {
        console.log(data);
    };

    return (
        <div
            className={
                "flex flex-col gap-4 items-center container w-full lg:w-2/3 max-w-2xl mx-auto my-4 *:w-full"
            }
        >
            {/* change experience descriptors */}
            <div className={"p-6 rounded-lg flex flex-col gap-5"}>
                <article className={"mb-4"}>
                    <h1 className={"text-lg md:text-xl mb-1 font-semibold"}>
                        Change public appearance
                    </h1>
                    <p>
                        Changing your public appearance will update how it is
                        displayed to others.
                    </p>
                </article>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full"
                    >
                        <div className={"flex flex-col space-y-8"}>
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Experience title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your title..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="subtitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Experience subtitle
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your subtitle..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Experience description
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                rows={10}
                                                placeholder="Enter your description..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="subdomain"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Experience subdomain
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={true}
                                                placeholder="Enter your description..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            How people will access your page:
                                            universe.heritagelab.center/
                                            <b>
                                                <i>subdomain</i>
                                            </b>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="featured-picture"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Featured picture</FormLabel>
                                        <Avatar
                                            className={
                                                "w-32 h-32 my-2 hover:brightness-75 transition-all cursor-pointer"
                                            }
                                        >
                                            <AvatarImage
                                                src={experience.featured_image}
                                                alt={
                                                    "featured image for " +
                                                    experience.title
                                                }
                                            />
                                            <AvatarFallback>
                                                {experience.title.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                className={"w-fit"}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div>
                                <Button
                                    variant={"default"}
                                    className={"w-fit"}
                                    disabled
                                >
                                    Apply
                                </Button>
                                <Button
                                    variant={"ghost"}
                                    className={"w-fit"}
                                    disabled
                                >
                                    Revert
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>

            {/* change visibility of experience // */}
            <Separator className={"w-full"} />
            <div className={"p-6 rounded-lg flex flex-col gap-5"}>
                <article className={"mb-4"}>
                    <h1 className={"text-lg md:text-xl mb-1 font-semibold"}>
                        Change visibility?
                    </h1>
                    <p>
                        Make your site only available to team members by setting
                        it to private, or make it only viewable through an URL.
                    </p>
                </article>
                <div className="flex flex-col gap-6">
                    <RadioGroup defaultValue={experience.visibility}>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem id="public" value={"public"} />
                            <div className="grid gap-2">
                                <Label htmlFor="terms">
                                    Should this experience be listed publicly?
                                </Label>
                                <p className="text-muted-foreground text-sm">
                                    This will make your experience be listed on
                                    our experiences page.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem id="unlisted" value={"unlisted"} />
                            <div className="grid gap-2">
                                <Label htmlFor="terms">
                                    Should this experience only be available
                                    through a link?
                                </Label>
                                <p className="text-muted-foreground text-sm">
                                    This will make your experience be <b>not</b>{" "}
                                    listed on our experiences page.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <RadioGroupItem id="private" value={"private"} />
                            <div className="grid gap-2">
                                <Label htmlFor="terms-2">
                                    Should this experience be private?
                                </Label>
                                <p className="text-muted-foreground text-sm">
                                    This will make your experience only visible
                                    to team members.
                                </p>
                            </div>
                        </div>
                    </RadioGroup>
                    <Button variant={"default"} className={"w-fit"} disabled>
                        Apply
                    </Button>
                </div>
            </div>

            {/* delete experience (disabled) */}
            <Separator className={"w-full"} />
            <div className={"p-6 rounded-lg flex flex-col gap-5"}>
                <article className={"mb-4"}>
                    <h1 className={"text-lg md:text-xl mb-1 font-semibold"}>
                        Delete experience?
                    </h1>
                    <p>
                        Deleting your experience is permanent and cannot be
                        undone.
                    </p>
                </article>
                <Button variant={"destructive"} className={"w-fit"} disabled>
                    Delete experience
                </Button>
            </div>
        </div>
    );
}
