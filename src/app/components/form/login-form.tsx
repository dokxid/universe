"use client";

import { logInAction } from "@/actions/auth";
import {
    SettingsBoxContent,
    SettingsBoxFormElement,
    SettingsFormDescription,
    SettingsFormTitle,
} from "@/app/components/layout/content-layout";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Form,
    FormControl,
    FormField,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Organization } from "@/types/workos-errors";
import { Check, ChevronsUpDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type Inputs = {
    email: string;
    password: string;
    organizationId: string;
};

export function LoginForm() {
    const [pendingAuthToken, setPendingAuthToken] = useState<string | null>(
        null
    );
    const pathname = usePathname();
    const slug = pathname.split("/")[1];
    const router = useRouter();
    const [organizations, setOrganizations] = useState<Organization[]>([
        { id: "slug", name: slug },
    ]);

    const form = useForm<Inputs>({
        defaultValues: {
            email: "",
            password: "",
            organizationId: organizations[0].id,
        },
    });

    function onSubmit(data: Inputs) {
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("organizationId", data.organizationId);
        if (pendingAuthToken) {
            formData.append("pendingAuthToken", pendingAuthToken);
        }
        logInAction(formData).then((res) => {
            if (!res) return;
            if (res.redirectUrl) {
                router.push(res.redirectUrl);
                return;
            }
            if (res.pendingAuthToken && res.organizations) {
                setPendingAuthToken(res.pendingAuthToken);
                setOrganizations(res.organizations || []);
                form.setValue(
                    "organizationId",
                    res.organizations.find((org) => org.name === slug)?.id || ""
                );
                form.clearErrors("organizationId");
                return;
            }
            Object.entries(res).forEach(([field, message]) => {
                form.setError(field as keyof Inputs, {
                    type: "manual",
                    message: message.message || message,
                });
            });
        });
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
                                    <a
                                        href="#"
                                        className="ml-auto text-xs text-muted-foreground underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
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
                        name={"organizationId"}
                        render={({ field }) => (
                            <SettingsBoxFormElement>
                                <FormLabel className="flex shrink-0 justify-between">
                                    Heritage Lab
                                </FormLabel>
                                <FormControl>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    disabled={!pendingAuthToken}
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between",
                                                        !field.value &&
                                                            "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? organizations.find(
                                                              (org) =>
                                                                  org.id ===
                                                                  field.value
                                                          )?.name
                                                        : "Select lab"}
                                                    <ChevronsUpDown className="opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput
                                                    placeholder="Search framework..."
                                                    className="h-9"
                                                />
                                                <CommandList>
                                                    <CommandEmpty>
                                                        No framework found.
                                                    </CommandEmpty>
                                                    <CommandGroup>
                                                        {organizations.map(
                                                            (org) => (
                                                                <CommandItem
                                                                    value={
                                                                        org.id
                                                                    }
                                                                    key={org.id}
                                                                    onSelect={() => {
                                                                        form.setValue(
                                                                            "organizationId",
                                                                            org.id
                                                                        );
                                                                    }}
                                                                >
                                                                    {org.name}
                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto",
                                                                            org.id ===
                                                                                field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            )
                                                        )}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </FormControl>
                                {pendingAuthToken && (
                                    <div className="text-sm text-red-500 mt-1">
                                        Multiple organizations detected. Please
                                        select a lab to continue.
                                    </div>
                                )}
                                <FormMessage />
                            </SettingsBoxFormElement>
                        )}
                    />
                    <SettingsBoxFormElement>
                        {form.formState.errors && (
                            <div className="text-sm text-red-500"></div>
                        )}
                        <Button type="submit">Login</Button>
                    </SettingsBoxFormElement>
                    <SettingsBoxFormElement>
                        <SettingsFormDescription>
                            Don&apos;t have an account?{" "}
                            <a
                                href="#"
                                className="underline underline-offset-4"
                            >
                                Sign up
                            </a>
                        </SettingsFormDescription>
                    </SettingsBoxFormElement>
                </SettingsBoxContent>
            </form>
        </Form>
    );
}
