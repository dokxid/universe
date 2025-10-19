import { editVisibilityAndLicensingFormAction } from "@/actions/form/stories";
import { DebugListObject } from "@/app/components/cards/debug-list-object";
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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { CC_LICENSES, StoryDTO } from "@/types/dtos";
import { editVisibilityAndLicensingFormSchema } from "@/types/form-schemas/story-form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export function CCLicensesFormField({ story }: { story: StoryDTO }) {
    const editVisibilityAndLicensingForm = useForm({
        resolver: zodResolver(editVisibilityAndLicensingFormSchema),
        defaultValues: {
            draft: story.draft,
            license: story.license || "CC0",
        },
    });
    const onSubmit = async (
        data: z.output<typeof editVisibilityAndLicensingFormSchema>
    ) => {
        try {
            const formData = new FormData();
            formData.append("storyId", data.storyId);
            formData.append("license", data.license);
            formData.append("draft", String(data.draft));
            const result = await editVisibilityAndLicensingFormAction(formData);
            if (result?.success) {
                toast.success("Story updated successfully!");
            }
            if (result?.error) {
                const zodErrors = JSON.parse(result.error);
                Object.keys(zodErrors.fieldErrors).forEach((fieldName) => {
                    editVisibilityAndLicensingForm.setError(
                        fieldName as keyof z.input<
                            typeof editVisibilityAndLicensingFormSchema
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
        <SettingsFormBox className={"p-0"}>
            <Form {...editVisibilityAndLicensingForm}>
                <form
                    onSubmit={editVisibilityAndLicensingForm.handleSubmit(
                        onSubmit
                    )}
                >
                    <input
                        type={"hidden"}
                        {...editVisibilityAndLicensingForm.register("storyId")}
                        defaultValue={story._id}
                    />
                    <Collapsible>
                        <CollapsibleTrigger asChild>
                            <SettingsFormTitle className={"pb-0 mb-0"}>
                                <div className="flex flex-row cursor-pointer items-center gap-2">
                                    <ChevronDown className="inline size-5" />
                                    Visibility & Licensing
                                </div>
                            </SettingsFormTitle>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SettingsFormDescription className={"mt-3"}>
                                Edit the visibility and licensing of your story
                                here.
                            </SettingsFormDescription>
                            <SettingsBoxContent>
                                <SettingsBoxFormElement>
                                    <Label>Visibility</Label>
                                    <FormField
                                        control={
                                            editVisibilityAndLicensingForm.control
                                        }
                                        name="draft"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                <div className="space-y-0.5">
                                                    <FormLabel>
                                                        Draft Mode
                                                    </FormLabel>
                                                    <FormDescription>
                                                        This will make the story
                                                        invisible to the public.
                                                        Only you will be able to
                                                        see it.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </SettingsBoxFormElement>
                                <SettingsBoxFormElement>
                                    <Label>License</Label>
                                    <FormField
                                        control={
                                            editVisibilityAndLicensingForm.control
                                        }
                                        name="license"
                                        render={({ field }) => (
                                            <FormItem className={"mt-2"}>
                                                <FormControl>
                                                    <RadioGroup
                                                        value={field.value}
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                    >
                                                        {Object.entries(
                                                            CC_LICENSES
                                                        ).map(
                                                            ([
                                                                value,
                                                                label,
                                                            ]) => (
                                                                <div
                                                                    key={value}
                                                                    className="flex items-center space-x-2"
                                                                >
                                                                    <RadioGroupItem
                                                                        value={
                                                                            value
                                                                        }
                                                                        id={
                                                                            value
                                                                        }
                                                                    />
                                                                    <Label
                                                                        htmlFor={
                                                                            value
                                                                        }
                                                                    >
                                                                        {`${label.code} - ${label.name}`}
                                                                    </Label>
                                                                </div>
                                                            )
                                                        )}
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                                <FormDescription>
                                                    For more information about
                                                    this specific license,
                                                    visit:{" "}
                                                    <Link
                                                        href={
                                                            CC_LICENSES[
                                                                field.value
                                                            ].url
                                                        }
                                                        target="_blank"
                                                        className={
                                                            "link-external inline-block"
                                                        }
                                                    >
                                                        {
                                                            CC_LICENSES[
                                                                field.value
                                                            ].url
                                                        }
                                                    </Link>
                                                </FormDescription>
                                            </FormItem>
                                        )}
                                    />
                                </SettingsBoxFormElement>
                                <SettingsBoxFormElement>
                                    <SettingsFormButtonGroup>
                                        <Button
                                            variant={"default"}
                                            className={"w-fit"}
                                        >
                                            Apply
                                        </Button>
                                        <Button
                                            variant={"ghost"}
                                            className={"w-fit"}
                                        >
                                            Reset
                                        </Button>
                                    </SettingsFormButtonGroup>
                                </SettingsBoxFormElement>
                            </SettingsBoxContent>
                            <DebugListObject
                                data={editVisibilityAndLicensingForm.watch()}
                            />
                        </CollapsibleContent>
                    </Collapsible>
                </form>
            </Form>
        </SettingsFormBox>
    );
}
