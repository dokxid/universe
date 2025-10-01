"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { User } from "@workos-inc/node";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters."),
    lastName: z.string().min(2, "Last name must be at least 2 characters."),
    email: z.email(),
    profilePictureUrl: z.url().optional().nullable(),
    profilePicture: z
        .any()
        .refine((files) => files?.length === 1, "Please upload a file.")
        .refine((files) => files?.[0]?.size <= 5000000, "Max file size is 5MB.")
        .refine(
            (files) =>
                files.type === "image/jpeg" || files.type === "image/png",
            "Only .jpg, .png, and .webp files are accepted."
        ),
});

export function UserPreferencesDialog({ user }: { user: User }) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            profilePictureUrl: user.profilePictureUrl || null,
        },
    });

    const onSubmit = (data: FieldValues) => {
        console.log(data);
    };

    console.log(user.profilePictureUrl === null);

    return (
        <div
            className={
                "flex flex-col gap-4 items-start container max-w-2xl my-4 *:w-full"
            }
        >
            {/* change experience descriptors */}
            <div className={"p-6 rounded-lg flex flex-col gap-5"}>
                <article className={"mb-4"}>
                    <h1 className={"text-lg md:text-xl mb-1 font-semibold"}>
                        Change public appearance
                    </h1>
                    <p>
                        Changing your public appearance will update how it is
                        displayed to others.
                    </p>
                </article>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full"
                    >
                        <div className={"flex flex-col space-y-8"}>
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your first name..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your last name..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>E-Mail address</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="Enter your email..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="profilePicture"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Profile picture</FormLabel>
                                        <Avatar
                                            className={
                                                "w-32 h-32 my-2 hover:brightness-75 transition-all cursor-pointer"
                                            }
                                        >
                                            {user.profilePictureUrl ? (
                                                <AvatarImage
                                                    src={user.profilePictureUrl}
                                                    alt={
                                                        "profile picture for " +
                                                        user.firstName +
                                                        " " +
                                                        user.lastName
                                                    }
                                                />
                                            ) : (
                                                <AvatarFallback
                                                    className={
                                                        "text-4xl w-full h-full flex items-center justify-center bg-muted text-muted-foreground"
                                                    }
                                                >
                                                    {user.firstName &&
                                                    user.lastName
                                                        ? user.firstName
                                                              ?.charAt(0)
                                                              .toUpperCase() +
                                                          user.lastName
                                                              ?.charAt(0)
                                                              .toUpperCase()
                                                        : "N/A"}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                className={"w-fit"}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div>
                                <Button
                                    variant={"default"}
                                    className={"w-fit"}
                                    disabled
                                >
                                    Apply
                                </Button>
                                <Button
                                    variant={"ghost"}
                                    className={"w-fit"}
                                    disabled
                                >
                                    Revert
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>

            {/* request data (disabled) */}
            <Separator className={"w-full"} />
            <div className={"p-6 rounded-lg flex flex-col gap-5"}>
                <article className={"mb-4"}>
                    <h1 className={"text-lg md:text-xl mb-1 font-semibold"}>
                        Request your data
                    </h1>
                    <p>Requesting your data is a straightforward process.</p>
                </article>
                <Button variant={"default"} className={"w-fit"} disabled>
                    Request data
                </Button>
            </div>

            {/* delete experience (disabled) */}
            <Separator className={"w-full"} />
            <div className={"p-6 rounded-lg flex flex-col gap-5"}>
                <article className={"mb-4"}>
                    <h1 className={"text-lg md:text-xl mb-1 font-semibold"}>
                        Permanently delete this account
                    </h1>
                    <p>
                        The account will no longer be available, and all data in
                        the account will be permanently deleted.
                    </p>
                </article>
                <Button variant={"destructive"} className={"w-fit"} disabled>
                    Delete account
                </Button>
            </div>
        </div>
    );
}
