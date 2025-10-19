"use client";

import { LabPictureForm } from "@/app/components/form/lab-forms/lab-picture-form";
import {
    SettingsBoxContent,
    SettingsBoxForm,
    SettingsFormBox,
    SettingsFormButtonGroup,
    SettingsFormDescription,
    SettingsFormTitle,
    SettingsLayout,
} from "@/app/components/layout/content-layout";
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
import { Textarea } from "@/components/ui/textarea";
import { ExperienceDTO } from "@/types/dtos";
import { editLabAppearanceSchema } from "@/types/form-schemas/lab-form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";

export function TeamSettings({
    slug,
    experienceSerialized,
}: {
    slug: string;
    experienceSerialized: string;
}) {
    const experience = JSON.parse(experienceSerialized) as ExperienceDTO;
    const labAppearanceForm = useForm({
        resolver: zodResolver(editLabAppearanceSchema),
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
        <>
            <SettingsLayout>
                <SettingsFormBox>
                    <SettingsFormTitle>
                        Change public appearance
                    </SettingsFormTitle>
                    <SettingsFormDescription>
                        Changing your public appearance will update how it is
                        displayed to others.
                    </SettingsFormDescription>
                    <Form {...labAppearanceForm}>
                        <form
                            onSubmit={labAppearanceForm.handleSubmit(onSubmit)}
                            className="w-full"
                        >
                            <SettingsBoxContent>
                                <SettingsBoxForm>
                                    <FormField
                                        control={labAppearanceForm.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Experience title
                                                </FormLabel>
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
                                        control={labAppearanceForm.control}
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
                                        control={labAppearanceForm.control}
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
                                        control={labAppearanceForm.control}
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
                                                    How people will access your
                                                    page:
                                                    universe.heritagelab.center/
                                                    <b>
                                                        <i>subdomain</i>
                                                    </b>
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </SettingsBoxForm>
                                <SettingsFormButtonGroup>
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
                                </SettingsFormButtonGroup>
                            </SettingsBoxContent>
                        </form>
                    </Form>
                </SettingsFormBox>
                <LabPictureForm experience={experience} />
                <SettingsFormBox>
                    <SettingsFormTitle>Change visibility?</SettingsFormTitle>
                    <SettingsFormDescription>
                        Make your site only available to team members by setting
                        it to private, or make it only viewable through an URL.
                    </SettingsFormDescription>
                    <SettingsBoxContent>
                        <SettingsBoxForm>
                            <RadioGroup defaultValue={experience.visibility}>
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem
                                        id="public"
                                        value={"public"}
                                    />
                                    <div className="grid gap-2">
                                        <Label htmlFor="terms">
                                            Should this experience be listed
                                            publicly?
                                        </Label>
                                        <p className="text-muted-foreground text-sm">
                                            This will make your experience be
                                            listed on our experiences page.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem
                                        id="unlisted"
                                        value={"unlisted"}
                                    />
                                    <div className="grid gap-2">
                                        <Label htmlFor="terms">
                                            Should this experience only be
                                            available through a link?
                                        </Label>
                                        <p className="text-muted-foreground text-sm">
                                            This will make your experience be{" "}
                                            <b>not</b> listed on our experiences
                                            page.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <RadioGroupItem
                                        id="private"
                                        value={"private"}
                                    />
                                    <div className="grid gap-2">
                                        <Label htmlFor="terms-2">
                                            Should this experience be private?
                                        </Label>
                                        <p className="text-muted-foreground text-sm">
                                            This will make your experience only
                                            visible to team members.
                                        </p>
                                    </div>
                                </div>
                            </RadioGroup>
                        </SettingsBoxForm>
                        <SettingsFormButtonGroup>
                            <Button
                                variant={"default"}
                                className={"w-fit"}
                                disabled
                            >
                                Apply
                            </Button>
                        </SettingsFormButtonGroup>
                    </SettingsBoxContent>
                </SettingsFormBox>

                <SettingsFormBox>
                    <SettingsFormTitle>Delete experience?</SettingsFormTitle>
                    <SettingsFormDescription>
                        Deleting your experience is permanent and cannot be
                        undone.
                    </SettingsFormDescription>
                    <SettingsBoxContent>
                        <SettingsFormButtonGroup>
                            <Button
                                variant={"destructive"}
                                className={"w-fit"}
                                disabled
                            >
                                Delete experience
                            </Button>
                        </SettingsFormButtonGroup>
                    </SettingsBoxContent>
                </SettingsFormBox>
            </SettingsLayout>
        </>
    );
}
