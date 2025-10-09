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
    FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CC_LICENSES, StoryDTO } from "@/types/dtos";
import { editLicenseFormSchema } from "@/types/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

export function CCLicensesFormField({ story }: { story: StoryDTO }) {
    const editLicenseForm = useForm({
        resolver: zodResolver(editLicenseFormSchema),
        defaultValues: {
            license: story.license,
        },
    });
    return (
        <SettingsFormBox className={"p-0"}>
            <Form {...editLicenseForm}>
                <form onSubmit={editLicenseForm.handleSubmit(() => {})}>
                    <Collapsible>
                        <CollapsibleTrigger asChild>
                            <SettingsFormTitle className={"pb-0 mb-0"}>
                                <div className="flex flex-row cursor-pointer items-center gap-2">
                                    <ChevronDown className="inline size-5" />
                                    Licensing
                                </div>
                            </SettingsFormTitle>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SettingsFormDescription className={"mt-3"}>
                                Edit the licensing of your story here.
                            </SettingsFormDescription>
                            <SettingsBoxContent>
                                <SettingsBoxFormElement>
                                    <FormField
                                        control={editLicenseForm.control}
                                        name="license"
                                        render={({ field }) => (
                                            <FormItem className={"mt-2"}>
                                                {/* <Label>License</Label> */}
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
                                                                        {
                                                                            label.code
                                                                        }
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
                        </CollapsibleContent>
                    </Collapsible>
                </form>
            </Form>
        </SettingsFormBox>
    );
}
