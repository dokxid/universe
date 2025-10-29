"use client";

import {
    SettingsBoxContent,
    SettingsBoxFormElement,
    SettingsFormDescription,
    SettingsFormTitle,
} from "@/app/components/layout/content-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { loginFormSchema } from "@/types/form-schemas/auth-form-schemas";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";
import z from "zod";

export function LoginForm() {
    const pathname = usePathname();
    const slug = getLabSlugFromPathname(pathname);
    const router = useRouter();

    const form = useForm<z.infer<typeof loginFormSchema>>({
        defaultValues: {
            email: "",
            password: "",
            slug: slug || "",
        },
    });

    async function onSubmit(data: z.infer<typeof loginFormSchema>) {
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("rememberMe", String(data.rememberMe));
        formData.append("slug", data.slug);
        const response = await fetch("/auth/login", {
            method: "POST",
            body: formData,
        });
        const result = await response.json();
        console.log("Login result:", result);
        if (result) {
            mutate("currentUser");
            mutate(["userRoles", data.slug]);
            toast.success("Signed in successfully!");
            router.push(result.url || `/${data.slug}/map`);
        }
        handleFormErrors(result, form);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <SettingsFormTitle>Login to your account</SettingsFormTitle>
                <SettingsFormDescription>
                    Enter your email below to login to your account
                </SettingsFormDescription>
                <SettingsBoxContent>
                    <FormField
                        control={form.control}
                        name={"email"}
                        render={({ field }) => (
                            <SettingsBoxFormElement>
                                <FormLabel className="flex shrink-0">
                                    Email
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your email..."
                                        type="text"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </SettingsBoxFormElement>
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
                        name={"slug"}
                        render={({ field }) => (
                            <SettingsBoxFormElement>
                                <FormLabel className="flex shrink-0 justify-between">
                                    Lab
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={true}
                                        type="text"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </SettingsBoxFormElement>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="rememberMe"
                        render={({ field }) => (
                            <>
                                <label className="flex flex-row items-center gap-2 cursor-pointer">
                                    <FormControl>
                                        <Checkbox
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <p className="ml-1 text-sm select-none">
                                        Remember me
                                    </p>
                                </label>
                                <FormMessage />
                            </>
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
