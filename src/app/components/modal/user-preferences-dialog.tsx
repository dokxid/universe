"use client";

import {
    SettingsBoxContent,
    SettingsBoxForm,
    SettingsFormBox,
    SettingsFormDescription,
    SettingsFormTitle,
    SettingsLayout,
} from "@/app/components/layout/content-layout";
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
import { Toggle } from "@/components/ui/toggle";
import { useAppSelector } from "@/lib/hooks";
import { setDebug } from "@/lib/redux/settings/settings-slice";
import { userPreferencesFormSchema } from "@/types/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const formSchema = userPreferencesFormSchema;

export function UserPreferencesDialog() {
    const { user, loading } = useAuth();
    const debug = useAppSelector((state) => state.settings.debug);
    const dispatch = useDispatch();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            profilePictureUrl: "",
        },
    });

    useEffect(() => {
        form.reset({
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            profilePictureUrl: user?.profilePictureUrl || null,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const onSubmit = (data: FieldValues) => {
        console.log(data);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <SettingsLayout>
            <SettingsFormBox>
                <SettingsFormTitle>Change public appearance</SettingsFormTitle>
                <SettingsFormDescription>
                    Changing your public appearance will update how it is
                    displayed to others.
                </SettingsFormDescription>
                <SettingsBoxContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="w-full"
                        >
                            <SettingsBoxForm>
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
                                            <FormLabel>
                                                E-Mail address
                                            </FormLabel>
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
                                            <FormLabel>
                                                Profile picture
                                            </FormLabel>
                                            <Avatar
                                                className={
                                                    "w-32 h-32 my-2 hover:brightness-75 transition-all cursor-pointer"
                                                }
                                            >
                                                {user.profilePictureUrl ? (
                                                    <AvatarImage
                                                        src={
                                                            user.profilePictureUrl
                                                        }
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
                            </SettingsBoxForm>
                        </form>
                    </Form>
                </SettingsBoxContent>
            </SettingsFormBox>

            <SettingsFormBox>
                <SettingsFormTitle>Toggle Debug Mode</SettingsFormTitle>
                <SettingsFormDescription>
                    Debug mode enables additional logging and diagnostic
                    information to help troubleshoot issues.
                </SettingsFormDescription>
                <SettingsBoxContent>
                    <Toggle
                        variant={"secondary_custom"}
                        pressed={debug}
                        onPressedChange={(value) => dispatch(setDebug(value))}
                    >
                        Debug Mode
                    </Toggle>
                </SettingsBoxContent>
            </SettingsFormBox>

            <SettingsFormBox>
                <SettingsFormTitle>Request your data</SettingsFormTitle>
                <SettingsFormDescription>
                    Requesting your data is a straightforward process.
                </SettingsFormDescription>
                <SettingsBoxContent>
                    <Button variant={"default"} className={"w-fit"} disabled>
                        Request data
                    </Button>
                </SettingsBoxContent>
            </SettingsFormBox>

            <SettingsFormBox>
                <SettingsFormTitle>
                    Permanently delete this account
                </SettingsFormTitle>
                <SettingsFormDescription>
                    The account will no longer be available, and all data in the
                    account will be permanently deleted.
                </SettingsFormDescription>
                <SettingsBoxContent>
                    <Button
                        variant={"destructive"}
                        className={"w-fit"}
                        disabled
                    >
                        Delete account
                    </Button>
                </SettingsBoxContent>
            </SettingsFormBox>
        </SettingsLayout>
    );
}
