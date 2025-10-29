"use client";

import { editStoryFeaturedPictureAction } from "@/actions/form/stories";
import { DebugListObject } from "@/app/components/cards/debug-list-object";
import { HostedImage } from "@/app/components/embeds/s3-image";
import {
    SettingsBoxContent,
    SettingsBoxFormElement,
    SettingsFormBox,
    SettingsFormButtonGroup,
    SettingsFormDescription,
    SettingsFormTitle,
} from "@/app/components/layout/content-layout";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StoryDTO } from "@/types/dtos";
import { editFeaturedPictureFormSchema } from "@/types/form-schemas/story-form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export function FeaturedPictureFormField({ story }: { story: StoryDTO }) {
    const editFeaturedPictureForm = useForm({
        resolver: zodResolver(editFeaturedPictureFormSchema),
        defaultValues: {
            storyId: story.id,
            lab: story.lab.slug,
            featuredPicture: undefined,
        },
    });

    const onSubmit = (data: z.output<typeof editFeaturedPictureFormSchema>) => {
        try {
            const formData = new FormData();
            formData.append("storyId", data.storyId);
            formData.append("lab", data.lab);
            formData.append("featuredPicture", data.featuredPicture as File);
            editStoryFeaturedPictureAction(formData);
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image. Please try again.");
        }
    };

    return (
        <SettingsFormBox className={"p-0"}>
            <Form {...editFeaturedPictureForm}>
                <form onSubmit={editFeaturedPictureForm.handleSubmit(onSubmit)}>
                    <Collapsible>
                        <CollapsibleTrigger asChild>
                            <SettingsFormTitle className={"pb-0 mb-0"}>
                                <div className="flex flex-row cursor-pointer items-center gap-2">
                                    <ChevronDown className="inline size-5" />
                                    Change featured picture
                                </div>
                            </SettingsFormTitle>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SettingsFormDescription className={"mt-3"}>
                                Change the featured picture for your story here.
                            </SettingsFormDescription>
                            <SettingsBoxContent>
                                <SettingsBoxFormElement>
                                    <Label>Current featured image</Label>
                                    <AspectRatio
                                        ratio={16 / 9}
                                        className={"w-full"}
                                    >
                                        <HostedImage
                                            fileName={story.featuredImageUrl}
                                            alt={story.title}
                                        />
                                    </AspectRatio>
                                </SettingsBoxFormElement>
                                <SettingsBoxFormElement>
                                    <FormField
                                        name="featuredPicture"
                                        control={
                                            editFeaturedPictureForm.control
                                        }
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label className="flex shrink-0">
                                                    Featured picture
                                                </Label>
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        onChange={(e) => {
                                                            const file =
                                                                e.target
                                                                    .files?.[0] ||
                                                                null;
                                                            if (!file) {
                                                                return;
                                                            }
                                                            // update RHF with the actual File object
                                                            field.onChange(
                                                                file
                                                            );
                                                            editFeaturedPictureForm.setValue(
                                                                "featuredPicture",
                                                                file
                                                            );
                                                            // run validation right away
                                                            editFeaturedPictureForm.trigger(
                                                                "featuredPicture"
                                                            );
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </SettingsBoxFormElement>
                                <SettingsBoxFormElement>
                                    <FormField
                                        name="storyId"
                                        control={
                                            editFeaturedPictureForm.control
                                        }
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Story ID</Label>
                                                <FormControl>
                                                    <Input
                                                        disabled={true}
                                                        type="text"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </SettingsBoxFormElement>
                                <SettingsBoxFormElement>
                                    <FormField
                                        name="lab"
                                        control={
                                            editFeaturedPictureForm.control
                                        }
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Lab</Label>
                                                <FormControl>
                                                    <Input
                                                        disabled={true}
                                                        type="text"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </SettingsBoxFormElement>
                                <SettingsBoxFormElement>
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
                            </SettingsBoxContent>
                            <DebugListObject
                                data={editFeaturedPictureForm.watch()}
                            />
                        </CollapsibleContent>
                    </Collapsible>
                </form>
            </Form>
        </SettingsFormBox>
    );
}
