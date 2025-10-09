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
import { editCoordinatesFormSchema } from "@/types/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";

export function CoordinatesFormField({ story }: { story: StoryDTO }) {
    const editCoordinatesForm = useForm({
        resolver: zodResolver(editCoordinatesFormSchema),
        defaultValues: {
            longitude: story.location.coordinates[0],
            latitude: story.location.coordinates[1],
        },
    });
    return (
        <SettingsFormBox className={"p-0"}>
            <Form {...editCoordinatesForm}>
                <form onSubmit={editCoordinatesForm.handleSubmit(() => {})}>
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
                                        control={editCoordinatesForm.control}
                                        name="longitude"
                                        render={({ field }) => (
                                            <FormItem className={"mt-2"}>
                                                <Label>Longitude</Label>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="any"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={editCoordinatesForm.control}
                                        name="latitude"
                                        render={({ field }) => (
                                            <FormItem className={"mt-2"}>
                                                <Label>Latitude</Label>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="any"
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
                        </CollapsibleContent>
                    </Collapsible>
                </form>
            </Form>
        </SettingsFormBox>
    );
}
