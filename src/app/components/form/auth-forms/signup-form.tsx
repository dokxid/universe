"use client";

import { signUpAction } from "@/actions/form/auth";
import {
    SettingsBoxContent,
    SettingsBoxFormElement,
    SettingsFormDescription,
    SettingsFormTitle,
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
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { getLabSlugFromPathname } from "@/lib/utils/pathname";
import { signUpFormSchema } from "@/types/form-schemas/auth-form-schemas";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export function SignupForm() {
    const pathName = usePathname();
    const slug = getLabSlugFromPathname(pathName);

    const form = useForm<z.infer<typeof signUpFormSchema>>({
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            displayName: "",
            labSlug: slug || "",
        },
    });

    async function onSubmit(data: z.infer<typeof signUpFormSchema>) {
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("confirmPassword", data.confirmPassword);
        formData.append("displayName", data.displayName || "");
        formData.append("labSlug", data.labSlug);
        const result = await signUpAction(formData);
        if (result?.success) {
            toast.success("Signed up successfully!");
        }
        if (result?.error) {
            if (!result.error.startsWith("{")) {
                toast.error("Failed to create lab: " + result.error);
                return;
            }
            const zodErrors = JSON.parse(result.error);
            Object.keys(zodErrors.fieldErrors).forEach((fieldName) => {
                form.setError(
                    fieldName as keyof z.input<typeof signUpFormSchema>,
                    {
                        type: "server",
                        message: zodErrors.fieldErrors[fieldName].join(", "),
                    }
                );
            });
            zodErrors.formErrors.forEach((error: string) => {
                toast.error(error);
            });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <SettingsFormTitle>Make a new Account</SettingsFormTitle>
                <SettingsFormDescription>
                    Enter your email below to create a new account
                </SettingsFormDescription>
                <SettingsBoxContent>
                    <FormField
                        control={form.control}
                        name={"email"}
                        render={({ field }) => (
                            <SettingsBoxFormElement>
                                <FormLabel className="flex shrink-0">
                                    Email address
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your email..."
                                        type="email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </SettingsBoxFormElement>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel optional={true}>
                                    Display Name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your display name..."
                                        type={"text"}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    When set, this name will be shown publicly
                                    on your profile and submitted stories, else
                                    it will be &quot;Anonymous&quot;. You can
                                    change this later.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={"password"}
                        render={({ field }) => (
                            <SettingsBoxFormElement>
                                <FormLabel className="flex shrink-0 justify-between">
                                    Password
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your password..."
                                        type="password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </SettingsBoxFormElement>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={"confirmPassword"}
                        render={({ field }) => (
                            <SettingsBoxFormElement>
                                <FormLabel className="flex shrink-0 justify-between">
                                    Confirm Password
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your password..."
                                        type="password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </SettingsBoxFormElement>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={"labSlug"}
                        render={({ field }) => (
                            <SettingsBoxFormElement>
                                <FormLabel className="flex shrink-0 justify-between">
                                    Lab to make account for
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        disabled={true}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </SettingsBoxFormElement>
                        )}
                    />
                    <SettingsBoxFormElement>
                        {form.formState.errors && (
                            <div className="text-sm text-red-500"></div>
                        )}
                        <Button
                            type="submit"
                            disabled={
                                form.formState.isSubmitting ||
                                !form.formState.isValid
                            }
                        >
                            {form.formState.isSubmitting ? (
                                <>
                                    <Spinner variant={"ellipsis"} />{" "}
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </SettingsBoxFormElement>
                </SettingsBoxContent>
            </form>
        </Form>
    );
}
