"use client";

import {
    editLabAppearanceAction,
    editLabContentAction,
    editLabVisibilityAction,
} from "@/actions/form/labs";
import { LabPictureForm } from "@/app/components/form/lab-forms/lab-picture-form";
import {
    SettingsBoxContent,
    SettingsBoxForm,
    SettingsBoxFormElement,
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
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { handleFormErrors } from "@/lib/utils/form-error-handling";
import { LabDTO } from "@/types/dtos";
import { LAB_VISIBILITY_OPTIONS } from "@/types/form-schemas/form-schemas";
import {
    editLabContentSchema,
    editLabAppearanceSchema,
    editVisibilityFormSchema,
} from "@/types/form-schemas/lab-form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";
import { z } from "zod";
import { DebugListObject } from "../cards/debug-list-object";

export function LabSettings({
    slug,
    labSerialized,
}: {
    slug: string;
    labSerialized: string;
}) {
    const lab = JSON.parse(labSerialized) as LabDTO;
    const router = useRouter();

    const labAppearanceForm = useForm({
        resolver: zodResolver(editLabAppearanceSchema),
        defaultValues: {
            lab: slug,
            title: lab.name || "",
            subtitle: lab.subtitle || "",
            subdomain: slug,
        },
    });

    const visibilityForm = useForm({
        resolver: zodResolver(editVisibilityFormSchema),
        defaultValues: {
            lab: slug,
            visibility: lab.visibility as LAB_VISIBILITY_OPTIONS,
        },
    });

    const contentForm = useForm({
        resolver: zodResolver(editLabContentSchema),
        defaultValues: {
            lab: slug,
            content: lab.content || "",
        },
    });

    const onAppearanceSubmit = async (data: FieldValues) => {
        try {
            const formData = new FormData();
            formData.append("lab", slug);
            formData.append("title", data.title);
            formData.append("subtitle", data.subtitle);
            formData.append("subdomain", data.subdomain);
            const { result, redirect } = await editLabAppearanceAction(
                formData
            );
            if (result?.success) {
                toast.success("Lab updated successfully!");
                mutate(["labs", slug]);
                if (redirect) router.push(redirect);
            }
            if (result?.error) {
                const zodErrors = JSON.parse(result.error);
                Object.keys(zodErrors.fieldErrors).forEach((fieldName) => {
                    labAppearanceForm.setError(
                        fieldName as keyof z.infer<
                            typeof editLabAppearanceSchema
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
            console.error("Error updating lab appearance:", error);
            toast.error("Failed to update lab appearance.");
        }
    };

    const onVisibilitySubmit = async (data: FieldValues) => {
        try {
            const formData = new FormData();
            formData.append("lab", slug);
            formData.append("visibility", data.visibility);
            const result = await editLabVisibilityAction(formData);
            if (result?.success) {
                toast.success("Story updated successfully!");
                mutate(["labs", slug]);
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
            console.error("Error updating lab visibility:", error);
            toast.error("Failed to update lab visibility.");
        }
    };

    const onContentSubmit = async (data: FieldValues) => {
        try {
            const formData = new FormData();
            formData.append("lab", slug);
            formData.append("content", data.content);
            console.log("Submitting content form data:", data);
            const result = await editLabContentAction(formData);
            if (result?.success) {
                toast.success("Lab content updated successfully!");
                mutate(["labs", slug]);
            }
            if (result?.error) {
                handleFormErrors(result, contentForm);
            }
        } catch (error) {
            console.error("Error updating lab content:", error);
            toast.error("Failed to update lab content.");
        }
    }

    const onContentReset = () => {
        contentForm.reset({
            content: lab.content || "",
        });
    }

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
                            onSubmit={labAppearanceForm.handleSubmit(
                                onAppearanceSubmit
                            )}
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
                                                    Lab title
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
                                                    Lab subtitle
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
                                        name="subdomain"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Lab subdomain
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
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
                                        type={"submit"}
                                    >
                                        Apply
                                    </Button>
                                    <Button
                                        variant={"ghost"}
                                        className={"w-fit"}
                                        type={"reset"}
                                    >
                                        Reset
                                    </Button>
                                </SettingsFormButtonGroup>
                            </SettingsBoxContent>
                        </form>
                    </Form>
                </SettingsFormBox>
                <Form {...contentForm}>
                    <form
                        onSubmit={contentForm.handleSubmit(onContentSubmit)}
                        onReset={onContentReset}
                        className="w-full"
                    >
                        <SettingsBoxContent>
                            <SettingsBoxFormElement>
                                <FormField
                                    name="content"
                                    control={contentForm.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <MinimalTiptapEditor
                                                    output="html"
                                                    editorContentClassName={
                                                        "w-full prose p-5 dark:prose-invert max-w-full overflow-y-auto self-start my-10"
                                                    }
                                                    className={
                                                        "prose-content min-w-full w-full max-h-[80svh]"
                                                    }
                                                    placeholder={"enter your content here"}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </SettingsBoxFormElement>
                            <SettingsBoxFormElement>
                                <SettingsFormButtonGroup className="">
                                    <Button
                                        variant={"default"}
                                        className={"w-fit"}
                                        type={"submit"}
                                        onClick={() => {
                                            console.log("Submitting content form with data:", contentForm.getValues());
                                        }}
                                    >
                                        Apply
                                    </Button>
                                    <Button
                                        variant={"ghost"}
                                        className={"w-fit"}
                                        type={"reset"}
                                    >
                                        Reset
                                    </Button>
                                </SettingsFormButtonGroup>
                            </SettingsBoxFormElement>
                        </SettingsBoxContent>
                    </form>
                </Form>
                <DebugListObject data={contentForm.watch()} />
                <LabPictureForm lab={lab} />
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
                                                                lab be
                                                                listed publicly?
                                                            </Label>
                                                            <p className="text-muted-foreground text-sm">
                                                                This will make
                                                                your lab
                                                                be listed on our
                                                                featured labs page.
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
                                                                lab only
                                                                be available
                                                                through a link?
                                                            </Label>
                                                            <p className="text-muted-foreground text-sm">
                                                                This will make
                                                                your lab
                                                                be <b>not</b>{" "}
                                                                listed on our
                                                                featured labs
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
                                                                lab be
                                                                private?
                                                            </Label>
                                                            <p className="text-muted-foreground text-sm">
                                                                This will make
                                                                your lab
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
                    <SettingsFormTitle>Delete lab?</SettingsFormTitle>
                    <SettingsFormDescription>
                        Deleting your lab is permanent and cannot be
                        undone.
                    </SettingsFormDescription>
                    <SettingsBoxContent>
                        <SettingsFormButtonGroup>
                            <Button
                                variant={"destructive"}
                                className={"w-fit"}
                                disabled
                            >
                                Delete lab
                            </Button>
                        </SettingsFormButtonGroup>
                    </SettingsBoxContent>
                </SettingsFormBox>
            </SettingsLayout >
        </>
    );
}
