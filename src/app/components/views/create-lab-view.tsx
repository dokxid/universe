"use client";

import { createLabFormAction } from "@/actions/form/labs";
import { DebugListObject } from "@/app/components/cards/debug-list-object";
import {
    ContentLayoutInner,
    SettingsBoxContent,
    SettingsBoxFormElement,
    SettingsFormBox,
    SettingsFormButtonGroup,
    SettingsFormDescription,
    SettingsFormTitle,
    SettingsLayout,
} from "@/app/components/layout/content-layout";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { Skeleton } from "@/components/ui/skeleton";
import { createLabFormSchema } from "@/types/form-schemas/lab-form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function CreateLabView() {
    const createLabForm = useForm<z.infer<typeof createLabFormSchema>>({
        resolver: zodResolver(createLabFormSchema),
        defaultValues: {
            name: "",
            subtitle: "",
            content: undefined,
            slug: "",
            visibility: "public",
            image: undefined,
            adminEmail: "",
            initialZoom: 5,
        },
    });

    const onSubmit = async (data: z.output<typeof createLabFormSchema>) => {
        try {
            const formData = new FormData();
            formData.append("title", data.name);
            formData.append("subtitle", data.subtitle);
            formData.append("content", data.content);
            formData.append("slug", data.slug);
            formData.append("visibility", data.visibility);
            formData.append("longitude", data.longitude.toFixed(6).toString());
            formData.append("latitude", data.latitude.toFixed(6).toString());
            formData.append("initialZoom", data.initialZoom.toString());
            formData.append("adminEmail", data.adminEmail);
            formData.append("image", data.image as File);
            const result = await createLabFormAction(formData);
            if (result?.success) {
                toast.success("Lab added successfully!");
            }
            if (result?.error) {
                if (!result.error.startsWith("{")) {
                    toast.error("Failed to create lab: " + result.error);
                    return;
                }
                const zodErrors = JSON.parse(result.error);
                Object.entries(
                    zodErrors.fieldErrors as Record<string, string[]>
                ).forEach(([field, messages]) => {
                    if (field in createLabForm.getValues()) {
                        createLabForm.setError(
                            field as keyof z.infer<typeof createLabFormSchema>,
                            {
                                type: "server",
                                message: messages.join(", "),
                            }
                        );
                    }
                    toast.error(field + ": " + JSON.stringify(messages));
                });
            }
        } catch (error) {
            console.error("Error creating a lab:", error);
            toast.error("Failed to create a lab");
        }
    };
    const onReset = () => {
        createLabForm.reset();
    };
    return (
        <ContentLayoutInner>
            <Form {...createLabForm}>
                <form
                    onSubmit={createLabForm.handleSubmit(onSubmit)}
                    onReset={onReset}
                    className="w-full"
                >
                    <SettingsLayout>
                        <SettingsFormBox className={"p-0"}>
                            <SettingsFormTitle className={""}>
                                Basic Information
                            </SettingsFormTitle>
                            <SettingsBoxContent>
                                <SettingsBoxFormElement>
                                    <FormField
                                        name={"name"}
                                        control={createLabForm.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Lab Name</Label>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter lab name"
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
                                        name={"subtitle"}
                                        control={createLabForm.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Lab Subtitle</Label>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter lab subtitle"
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
                                        name={"slug"}
                                        control={createLabForm.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Lab Subdomain</Label>
                                                <FormControl>
                                                    <Input
                                                        placeholder="example: my-lab -> my-lab.heritagelab.center"
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
                                        name={"adminEmail"}
                                        control={createLabForm.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Lab Admin Email</Label>
                                                <FormControl>
                                                    <Input
                                                        placeholder="example: admin@my-lab.heritagelab.center"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </SettingsBoxFormElement>
                            </SettingsBoxContent>
                        </SettingsFormBox>
                    </SettingsLayout>
                    <FormField
                        name="content"
                        control={createLabForm.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <MinimalTiptapEditor
                                        output="html"
                                        editorContentClassName={
                                            "prose p-5 dark:prose-invert max-w-full overflow-y-auto self-start my-10"
                                        }
                                        className={
                                            "prose-content w-full max-h-[80svh]"
                                        }
                                        placeholder={"enter your content here"}
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <SettingsLayout className={"snap-center"}>
                        <SettingsFormBox className={"p-0"}>
                            <Collapsible>
                                <CollapsibleTrigger asChild>
                                    <SettingsFormTitle className={"pb-0 mb-0"}>
                                        <div className="flex flex-row cursor-pointer items-center gap-2">
                                            <ChevronDown className="inline size-5" />
                                            Location
                                        </div>
                                    </SettingsFormTitle>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SettingsFormDescription className={"mt-3"}>
                                        Edit the location of your lab center
                                        here.
                                    </SettingsFormDescription>
                                    <SettingsBoxContent>
                                        <SettingsBoxFormElement>
                                            <AspectRatio
                                                ratio={16 / 9}
                                                className={"w-full"}
                                            >
                                                <Skeleton
                                                    className={
                                                        "w-full h-full flex items-center justify-center"
                                                    }
                                                >
                                                    <p className={""}>
                                                        Map Preview still in
                                                        progress...
                                                    </p>
                                                </Skeleton>
                                            </AspectRatio>
                                        </SettingsBoxFormElement>
                                        <SettingsBoxFormElement>
                                            <FormField
                                                control={createLabForm.control}
                                                name="longitude"
                                                render={({ field }) => (
                                                    <FormItem
                                                        className={"mt-2"}
                                                    >
                                                        <Label>Longitude</Label>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                {...field}
                                                                value={
                                                                    (field.value as number) ??
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        parseFloat(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    )
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={createLabForm.control}
                                                name="latitude"
                                                render={({ field }) => (
                                                    <FormItem
                                                        className={"mt-2"}
                                                    >
                                                        <Label>Latitude</Label>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                {...field}
                                                                value={
                                                                    (field.value as number) ??
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        parseFloat(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    )
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={createLabForm.control}
                                                name="initialZoom"
                                                render={({ field }) => (
                                                    <FormItem
                                                        className={"mt-2"}
                                                    >
                                                        <Label>
                                                            Zoom Level
                                                        </Label>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                {...field}
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    )
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </SettingsBoxFormElement>
                                    </SettingsBoxContent>
                                </CollapsibleContent>
                            </Collapsible>
                        </SettingsFormBox>
                        <SettingsFormBox className={"p-0"}>
                            <Collapsible>
                                <CollapsibleTrigger asChild>
                                    <SettingsFormTitle className={"pb-0 mb-0"}>
                                        <div className="flex flex-row cursor-pointer items-center gap-2">
                                            <ChevronDown className="inline size-5" />
                                            Lab Image
                                        </div>
                                    </SettingsFormTitle>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SettingsFormDescription className={"mt-3"}>
                                        Change the featured picture for your
                                        story here.
                                    </SettingsFormDescription>
                                    <SettingsBoxContent>
                                        <SettingsBoxFormElement>
                                            <FormField
                                                name="image"
                                                control={createLabForm.control}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Label className="flex shrink-0">
                                                            Featured picture
                                                        </Label>
                                                        <FormControl>
                                                            <Input
                                                                type="file"
                                                                onChange={(
                                                                    e
                                                                ) => {
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
                                                                    createLabForm.setValue(
                                                                        "image",
                                                                        file
                                                                    );
                                                                    // run validation right away
                                                                    createLabForm.trigger(
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
                                    </SettingsBoxContent>
                                </CollapsibleContent>
                            </Collapsible>
                        </SettingsFormBox>
                        <SettingsBoxContent>
                            <SettingsBoxFormElement>
                                <SettingsFormButtonGroup>
                                    <Button
                                        type="submit"
                                        variant={"default"}
                                        className={"w-fit"}
                                    >
                                        Create Lab
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
                            <DebugListObject data={createLabForm.watch()} />
                        </SettingsBoxContent>
                    </SettingsLayout>
                    <SettingsLayout className={""}></SettingsLayout>
                </form>
            </Form>
        </ContentLayoutInner>
    );
}
