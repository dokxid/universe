"use client";

import { resetPasswordAction } from "@/actions/form/auth";
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
    FormField,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { handleFormErrors } from "@/lib/utils/form-error-handling";
import { getLabSlugFromPathname } from "@/lib/utils/pathname";
import { resetPasswordFormSchema } from "@/types/form-schemas/auth-form-schemas";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export function ResetPasswordForm() {
    const pathname = usePathname();
    const slug = getLabSlugFromPathname(pathname);
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();

    const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
        defaultValues: {
            password: "",
            confirmPassword: "",
            token: token || "",
        },
    });

    async function onSubmit(data: z.infer<typeof resetPasswordFormSchema>) {
        try {
            const formData = new FormData();
            formData.append("password", data.password);
            formData.append("confirmPassword", data.confirmPassword);
            formData.append("token", data.token);
            const result = await resetPasswordAction(formData);
            if (result?.success) {
                toast.success("Reset passwords successfully!");
                router.push(`/${slug}/login`);
                return;
            }
            if (result?.error) {
                handleFormErrors(result, form);
            }
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Unknown error",
            );
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <SettingsFormTitle>Reset your password</SettingsFormTitle>
                <SettingsFormDescription>
                    Enter your email and new password to reset your password.
                </SettingsFormDescription>
                <SettingsBoxContent>
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
                                    Confirm password
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
                            Login
                        </Button>
                    </SettingsBoxFormElement>
                    <SettingsBoxFormElement>
                        <SettingsFormDescription
                            className={"flex flex-col gap-2"}
                        >
                            <Link
                                href="#"
                                className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                            >
                                Forgot your password?
                            </Link>
                            <Link
                                href={`/${slug}/signup`}
                                className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                            >
                                Sign up
                            </Link>
                        </SettingsFormDescription>
                    </SettingsBoxFormElement>
                </SettingsBoxContent>
            </form>
        </Form>
    );
}
