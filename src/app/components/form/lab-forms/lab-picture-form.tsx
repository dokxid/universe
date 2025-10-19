"use client";

import { editLabPictureAction } from "@/actions/form/labs";
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
import { getLabSlugFromPathname } from "@/lib/utils/pathname";
import { ExperienceDTO } from "@/types/dtos";
import { editLabImageFormSchema } from "@/types/form-schemas/lab-form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";
import z from "zod";

export function LabPictureForm({ experience }: { experience: ExperienceDTO }) {
    const slug = getLabSlugFromPathname(usePathname());
    const editLabPictureForm = useForm({
        resolver: zodResolver(editLabImageFormSchema),
        defaultValues: {
            lab: slug,
            image: undefined,
        },
    });

    const onSubmit = async (data: z.output<typeof editLabImageFormSchema>) => {
        try {
            const formData = new FormData();
            formData.append("lab", data.lab);
            formData.append("image", data.image as File);
            const result = await editLabPictureAction(formData);
            if (result?.success) {
                toast.success("Lab image updated successfully!");
                mutate(["labs", slug]);
            }
            if (result?.error) {
                const zodErrors = JSON.parse(result.error);
                Object.keys(zodErrors.fieldErrors).forEach((fieldName) => {
                    editLabPictureForm.setError(
                        fieldName as keyof z.infer<
                            typeof editLabImageFormSchema
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
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image. Please try again.");
        }
    };

    return (
        <SettingsFormBox className={"p-0"}>
            <Form {...editLabPictureForm}>
                <form onSubmit={editLabPictureForm.handleSubmit(onSubmit)}>
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
                                Change the featured picture for your lab here.
                            </SettingsFormDescription>
                            <SettingsBoxContent>
                                <SettingsBoxFormElement>
                                    <Label>Current featured image</Label>
                                    <AspectRatio
                                        ratio={16 / 9}
                                        className={"w-full"}
                                    >
                                        <HostedImage
                                            fileName={
                                                experience.featured_image_url
                                            }
                                            alt={experience.title}
                                        />
                                    </AspectRatio>
                                </SettingsBoxFormElement>
                                <SettingsBoxFormElement>
                                    <FormField
                                        name="image"
                                        control={editLabPictureForm.control}
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
                                                            editLabPictureForm.setValue(
                                                                "image",
                                                                file
                                                            );
                                                            // run validation right away
                                                            editLabPictureForm.trigger(
                                                                "image"
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
                                data={editLabPictureForm.watch()}
                            />
                        </CollapsibleContent>
                    </Collapsible>
                </form>
            </Form>
        </SettingsFormBox>
    );
}
