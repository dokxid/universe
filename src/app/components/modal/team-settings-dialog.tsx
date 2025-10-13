"use client";

import { editLabVisibilityFormAction } from "@/actions/labs";
import {
    SettingsBoxContent,
    SettingsBoxForm,
    SettingsFormBox,
    SettingsFormButtonGroup,
    SettingsFormDescription,
    SettingsFormTitle,
    SettingsLayout,
} from "@/app/components/layout/content-layout";
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
import { Textarea } from "@/components/ui/textarea";
import { Experience } from "@/types/dtos";
import {
    editVisibilityFormSchema,
    LAB_VISIBILITY_OPTIONS,
    teamSettingsFormSchema,
} from "@/types/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = teamSettingsFormSchema;
export function TeamSettingsDialog({
    slug,
    experienceSerialized,
}: {
    slug: string;
    experienceSerialized: string;
}) {
    const experience = JSON.parse(experienceSerialized) as Experience;
    const displayForm = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            slug: slug,
            title: experience.title || "",
            subtitle: experience.subtitle || "",
            description: experience.description || "",
            subdomain: slug,
        },
    });
    const visibilityForm = useForm({
        resolver: zodResolver(editVisibilityFormSchema),
        defaultValues: {
            slug: slug,
            visibility: experience.visibility as LAB_VISIBILITY_OPTIONS,
        },
    });

    const onSubmit = (data: FieldValues) => {
        console.log(data);
    };
    const onVisibilitySubmit = async (data: FieldValues) => {
        try {
            const formData = new FormData();
            formData.append("slug", slug);
            formData.append("visibility", data.visibility);
            const result = await editLabVisibilityFormAction(formData);
            if (result?.success) {
                toast.success("Story updated successfully!");
            }
            if (result?.error) {
                const zodErrors = JSON.parse(result.error);
                Object.keys(zodErrors.fieldErrors).forEach((fieldName) => {
                    visibilityForm.setError(
                        fieldName as keyof z.infer<
                            typeof editVisibilityFormSchema
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
            console.error("Error updating story content:", error);
            toast.error("Failed to update story content.");
        }
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
                    <Form {...displayForm}>
                        <form
                            onSubmit={displayForm.handleSubmit(onSubmit)}
                            className="w-full"
                        >
                            <SettingsBoxContent>
                                <SettingsBoxForm>
                                    <FormField
                                        control={displayForm.control}
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
                                        control={displayForm.control}
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
                                        control={displayForm.control}
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
                                        control={displayForm.control}
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
                                    <FormField
                                        control={displayForm.control}
                                        name="featured-picture"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Featured picture
                                                </FormLabel>
                                                <Avatar
                                                    className={
                                                        "w-32 h-32 my-2 hover:brightness-75 transition-all cursor-pointer"
                                                    }
                                                >
                                                    <AvatarImage
                                                        src={
                                                            experience.featured_image_url
                                                        }
                                                        alt={
                                                            "featured image for " +
                                                            experience.title
                                                        }
                                                    />
                                                    <AvatarFallback>
                                                        {experience.title.charAt(
                                                            0
                                                        )}
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
                                </SettingsBoxForm>
                                <SettingsFormButtonGroup>
                                    <Button
                                        variant={"default"}
                                        className={"w-fit"}
                                        type={"submit"}
                                        disabled={true}
                                    >
                                        Apply
                                    </Button>
                                    <Button
                                        variant={"ghost"}
                                        className={"w-fit"}
                                        type={"reset"}
                                        disabled={true}
                                    >
                                        Reset
                                    </Button>
                                </SettingsFormButtonGroup>
                            </SettingsBoxContent>
                        </form>
                    </Form>
                </SettingsFormBox>
                <SettingsFormBox>
                    <SettingsFormTitle>Change visibility?</SettingsFormTitle>
                    <SettingsFormDescription>
                        Make your site only available to team members by setting
                        it to private, or make it only viewable through an URL.
                    </SettingsFormDescription>
                    <SettingsBoxContent>
                        <Form {...visibilityForm}>
                            <form
                                onSubmit={visibilityForm.handleSubmit(
                                    onVisibilitySubmit
                                )}
                            >
                                <SettingsBoxForm>
                                    <SettingsFormButtonGroup>
                                        <FormField
                                            control={visibilityForm.control}
                                            name="visibility"
                                            render={({ field }) => (
                                                <RadioGroup
                                                    value={field.value}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <RadioGroupItem
                                                            id="public"
                                                            value={"public"}
                                                        />
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="terms">
                                                                Should this
                                                                experience be
                                                                listed publicly?
                                                            </Label>
                                                            <p className="text-muted-foreground text-sm">
                                                                This will make
                                                                your experience
                                                                be listed on our
                                                                experiences
                                                                page.
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
                                                                Should this
                                                                experience only
                                                                be available
                                                                through a link?
                                                            </Label>
                                                            <p className="text-muted-foreground text-sm">
                                                                This will make
                                                                your experience
                                                                be <b>not</b>{" "}
                                                                listed on our
                                                                experiences
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
                                                                Should this
                                                                experience be
                                                                private?
                                                            </Label>
                                                            <p className="text-muted-foreground text-sm">
                                                                This will make
                                                                your experience
                                                                only visible to
                                                                team members.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </RadioGroup>
                                            )}
                                        />
                                    </SettingsFormButtonGroup>
                                    <SettingsFormButtonGroup>
                                        <Button
                                            type={"submit"}
                                            variant={"default"}
                                            className={"w-fit"}
                                        >
                                            Apply
                                        </Button>
                                        <Button
                                            type={"reset"}
                                            variant={"ghost"}
                                            className={"w-fit"}
                                        >
                                            Reset
                                        </Button>
                                    </SettingsFormButtonGroup>
                                </SettingsBoxForm>
                            </form>
                        </Form>
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
