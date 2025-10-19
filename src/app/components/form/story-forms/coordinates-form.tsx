import { editStoryCoordinatesFormAction } from "@/actions/form/stories";
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
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { StoryDTO } from "@/types/dtos";
import { editStoryCoordinatesFormSchema } from "@/types/form-schemas/story-form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export function CoordinatesFormField({ story }: { story: StoryDTO }) {
    const editStoryCoordinatesForm = useForm({
        resolver: zodResolver(editStoryCoordinatesFormSchema),
        defaultValues: {
            longitude: story.location.coordinates[0],
            latitude: story.location.coordinates[1],
        },
    });
    const onSubmit = async (
        data: z.output<typeof editStoryCoordinatesFormSchema>
    ) => {
        try {
            const formData = new FormData();
            formData.append("storyId", data.storyId);
            formData.append("longitude", data.longitude.toFixed(6).toString());
            formData.append("latitude", data.latitude.toFixed(6).toString());
            const result = await editStoryCoordinatesFormAction(formData);
            if (result?.success) {
                toast.success("Story updated successfully!");
            }
            if (result?.error) {
                const zodErrors = JSON.parse(result.error);
                Object.keys(zodErrors.fieldErrors).forEach((fieldName) => {
                    editStoryCoordinatesForm.setError(
                        fieldName as keyof z.input<
                            typeof editStoryCoordinatesFormSchema
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
            <Form {...editStoryCoordinatesForm}>
                <form
                    onSubmit={editStoryCoordinatesForm.handleSubmit(onSubmit)}
                >
                    <input
                        type={"hidden"}
                        {...editStoryCoordinatesForm.register("storyId")}
                        defaultValue={story._id}
                    />
                    <Collapsible>
                        <CollapsibleTrigger asChild>
                            <SettingsFormTitle className={"pb-0 mb-0"}>
                                <div className="flex flex-row cursor-pointer items-center gap-2">
                                    <ChevronDown className="inline size-5" />
                                    Edit Location
                                </div>
                            </SettingsFormTitle>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SettingsFormDescription className={"mt-3"}>
                                Edit the location of your stories pin here.
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
                                                Map Preview still in progress...
                                            </p>
                                        </Skeleton>
                                    </AspectRatio>
                                </SettingsBoxFormElement>
                                <SettingsBoxFormElement>
                                    <FormField
                                        control={
                                            editStoryCoordinatesForm.control
                                        }
                                        name="longitude"
                                        render={({ field }) => (
                                            <FormItem className={"mt-2"}>
                                                <Label>Longitude</Label>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                parseFloat(
                                                                    e.target
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
                                        control={
                                            editStoryCoordinatesForm.control
                                        }
                                        name="latitude"
                                        render={({ field }) => (
                                            <FormItem className={"mt-2"}>
                                                <Label>Latitude</Label>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                parseFloat(
                                                                    e.target
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
                                data={editStoryCoordinatesForm.watch()}
                            />
                        </CollapsibleContent>
                    </Collapsible>
                </form>
            </Form>
        </SettingsFormBox>
    );
}
