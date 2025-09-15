"use client";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useAppSelector} from "@/lib/hooks";

export default function AddStoryForm() {

    const addStoryDialogue = useAppSelector(state => state.addStoryDialog)

    const formSchema = z.object({
        "text-0": z.string(),
        "text-input-0": z.string().min(1, {message: "This field is required"}),
        "textarea-1": z.string().min(1, {message: "This field is required"}),
        "tel-input-0": z.string(),
        "file-input-2": z.string(),
        "number-input-0": z.coerce.number().refine(value => value >= -180 && value <= 180, {}),
        "number-input-1": z.coerce.number().refine(value => value >= -90 && value <= 90, {}),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            "text-0": "",
            "text-input-0": "",
            "textarea-1": "",
            "tel-input-0": "",
            "file-input-2": "",
            "number-input-0": addStoryDialogue.longitude,
            "number-input-1": addStoryDialogue.latitude,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    function onReset() {
        form.reset();
        form.clearErrors();
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                onReset={onReset}
                className="space-y-8 @container"
            >
                <div className="grid grid-cols-12 gap-4">
                    <FormField
                        control={form.control}
                        name="text-input-0"
                        render={({field}) => (
                            <FormItem
                                className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="flex shrink-0">Story title</FormLabel>

                                <div className="w-full">
                                    <FormControl>
                                        <div className="relative w-full">
                                            <Input
                                                key="text-input-0"
                                                placeholder=""
                                                type="text"
                                                id="text-input-0"
                                                className=" "
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>

                                    <FormMessage/>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="textarea-1"
                        render={({field}) => (
                            <FormItem
                                className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="flex shrink-0">Description</FormLabel>

                                <div className="w-full">
                                    <FormControl>
                                        <Textarea
                                            key="textarea-1"
                                            id="textarea-1"
                                            placeholder=""
                                            className=""
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage/>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tel-input-0"
                        render={({field}) => (
                            <FormItem
                                className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="flex shrink-0">Year</FormLabel>

                                <div className="w-full">
                                    <FormControl>
                                        <div className="relative w-full">
                                            <Input
                                                key="tel-input-0"
                                                placeholder=""
                                                type="tel"
                                                id="tel-input-0"
                                                className=" "
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>

                                    <FormMessage/>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="file-input-2"
                        render={({field}) => (
                            <FormItem
                                className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="flex shrink-0">
                                    Featured picture
                                </FormLabel>

                                <div className="w-full">
                                    <FormControl>
                                        <div className="relative w-full">
                                            <Input
                                                key="file-input-2"
                                                placeholder=""
                                                type="file"
                                                id="file-input-2"
                                                className=" "
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>

                                    <FormMessage/>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="number-input-0"
                        render={({field}) => (
                            <FormItem
                                className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="flex shrink-0">Longitude</FormLabel>

                                <div className="w-full">
                                    <FormControl>
                                        <div className="relative w-full">
                                            <Input
                                                key="number-input-0"
                                                placeholder=""
                                                type="number"
                                                id="number-input-0"
                                                className=" "
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>

                                    <FormMessage/>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="number-input-1"
                        render={({field}) => (
                            <FormItem
                                className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="flex shrink-0">Lattitude</FormLabel>

                                <div className="w-full">
                                    <FormControl>
                                        <div className="relative w-full">
                                            <Input
                                                key="number-input-1"
                                                placeholder=""
                                                type="number"
                                                id="number-input-1"
                                                className=" "
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>

                                    <FormMessage/>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="submit-button-0"
                        render={() => (
                            <FormItem
                                className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="hidden shrink-0">Submit</FormLabel>

                                <div className="w-full">
                                    <FormControl>
                                        <Button
                                            key="submit-button-0"
                                            id="submit-button-0"
                                            name=""
                                            className="w-full"
                                            type="submit"
                                            variant="default"
                                        >
                                            Submit Story
                                        </Button>
                                    </FormControl>

                                    <FormMessage/>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>
            </form>
        </Form>
    );
}
