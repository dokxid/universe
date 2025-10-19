"use client";

import {
    editDisplayNameFormAction,
    editUserDetailsFormAction,
    editUserProfilePictureAction,
} from "@/actions/form/user";
import {
    SettingsBoxContent,
    SettingsBoxForm,
    SettingsBoxFormElement,
    SettingsFormBox,
    SettingsFormButtonGroup,
    SettingsFormDescription,
    SettingsFormTitle,
    SettingsLayout,
} from "@/app/components/layout/content-layout";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { useAppSelector } from "@/lib/hooks";
import { setDebug } from "@/lib/redux/settings/settings-slice";
import { useCurrentUser } from "@/lib/swr/user-hook";
import {
    editUserDetailsFormSchema,
    editUserDisplayNameFormSchema,
    editUserProfilePictureFormSchema,
} from "@/types/form-schemas/user-form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { mutate } from "swr";
import { z } from "zod";

const detailsFormSchema = editUserDetailsFormSchema;
const displayNameFormSchema = editUserDisplayNameFormSchema;
const profilePictureFormSchema = editUserProfilePictureFormSchema;

export function UserPreferences() {
    const { user, isLoading, isError } = useCurrentUser();
    const debug = useAppSelector((state) => state.settings.debug);
    const dispatch = useDispatch();

    const displayNameForm = useForm({
        resolver: zodResolver(displayNameFormSchema),
        defaultValues: {
            userId: "",
            displayName: "",
            firstName: "",
            lastName: "",
        },
    });

    const detailsForm = useForm({
        resolver: zodResolver(detailsFormSchema),
        defaultValues: {
            userId: "",
            publicEmail: "",
            description: "",
            position: "",
            phoneNumber: "",
            website: "",
        },
    });

    const profilePictureForm = useForm({
        resolver: zodResolver(profilePictureFormSchema),
        defaultValues: {
            userId: "",
            profilePicture: undefined,
        },
    });

    // initialize form values when user data is loaded
    useEffect(() => {
        if (!user) return; // Don't reset if user is not loaded

        displayNameForm.reset({
            userId: user._id || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            displayName: user.displayName || "",
        });
        profilePictureForm.reset({
            userId: user._id || "",
        });
        detailsForm.reset({
            userId: user._id || "",
            publicEmail: user.publicEmail || "",
            description: user.description || "",
            position: user.position || "",
            phoneNumber: user.phoneNumber || "",
            website: user.website || "",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const onDisplayNameReset = () => {
        displayNameForm.reset();
    };

    const onDisplayNameSubmit = async (
        data: z.output<typeof displayNameFormSchema>
    ) => {
        try {
            const formData = new FormData();
            formData.append("userId", data.userId);
            formData.append("displayName", data.displayName);
            formData.append("firstName", data.firstName);
            formData.append("lastName", data.lastName);
            const result = await editDisplayNameFormAction(formData);
            if (result?.success) {
                toast.success("Display name updated successfully!");
                mutate("currentUser");
            }
            if (result?.error) {
                const zodErrors = JSON.parse(result.error);
                Object.keys(zodErrors.fieldErrors).forEach((fieldName) => {
                    displayNameForm.setError(
                        fieldName as keyof z.infer<
                            typeof displayNameFormSchema
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
            console.error("Error updating display name:", error);
            toast.error("Failed to update display name.");
        }
    };

    const onDetailsReset = () => {
        detailsForm.reset();
    };

    const onDetailsSubmit = async (
        data: z.output<typeof detailsFormSchema>
    ) => {
        try {
            const formData = new FormData();
            formData.append("userId", data.userId);
            formData.append("publicEmail", data.publicEmail || "");
            formData.append("description", data.description || "");
            formData.append("position", data.position || "");
            formData.append("phoneNumber", data.phoneNumber || "");
            formData.append("website", data.website || "");
            const result = await editUserDetailsFormAction(formData);
            if (result?.success) {
                toast.success("User details updated successfully!");
                mutate("currentUser");
            }
            if (result?.error) {
                const zodErrors = JSON.parse(result.error);
                Object.keys(zodErrors.fieldErrors).forEach((fieldName) => {
                    detailsForm.setError(
                        fieldName as keyof z.infer<typeof detailsFormSchema>,
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
            console.error("Error updating user details:", error);
            toast.error("Failed to update user details.");
        }
    };

    const onProfilePictureReset = () => {
        profilePictureForm.reset();
    };

    const onProfilePictureSubmit = async (
        data: z.output<typeof profilePictureFormSchema>
    ) => {
        try {
            const formData = new FormData();
            formData.append("userId", data.userId);
            formData.append("profilePicture", data.profilePicture as File);
            const result = await editUserProfilePictureAction(formData);
            if (result?.success) {
                toast.success("Profile picture updated successfully!");
                mutate("currentUser");
            }
            if (result?.error) {
                const zodErrors = JSON.parse(result.error);
                Object.keys(zodErrors.fieldErrors).forEach((fieldName) => {
                    profilePictureForm.setError(
                        fieldName as keyof z.infer<
                            typeof profilePictureFormSchema
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
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image. Please try again.");
        }
    };
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>User not found</div>;
    }

    if (!user) {
        return <div>Cannot find user</div>;
    }

    return (
        <SettingsLayout>
            <SettingsFormBox>
                <SettingsFormTitle>Public display name</SettingsFormTitle>
                <SettingsFormDescription>
                    When all the name fields (including display name) are not
                    set, you will be shown as &quot;Anonymous&quot;.
                </SettingsFormDescription>
                <SettingsBoxContent>
                    <Form {...displayNameForm}>
                        <form
                            onSubmit={displayNameForm.handleSubmit(
                                onDisplayNameSubmit
                            )}
                            onReset={onDisplayNameReset}
                            className="w-full"
                        >
                            <SettingsBoxForm>
                                <FormField
                                    control={displayNameForm.control}
                                    name="displayName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Display Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your display name..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                When set, this will be shown
                                                instead of your full name.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={displayNameForm.control}
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
                                    control={displayNameForm.control}
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
                                <div>
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
                                </div>
                            </SettingsBoxForm>
                        </form>
                    </Form>
                </SettingsBoxContent>
            </SettingsFormBox>

            <SettingsFormBox>
                <SettingsFormTitle>Detailed information</SettingsFormTitle>
                <SettingsFormDescription>
                    Changing your detailed information will update how it is
                    displayed to others on your profile and your labs{" "}
                    <a className={"link-internal"} href={`/contact`}>
                        /contact
                    </a>{" "}
                    page.
                </SettingsFormDescription>
                <SettingsBoxContent>
                    <Form {...detailsForm}>
                        <form
                            onSubmit={detailsForm.handleSubmit(onDetailsSubmit)}
                            onReset={onDetailsReset}
                            className="w-full"
                        >
                            <SettingsBoxForm>
                                <FormField
                                    control={detailsForm.control}
                                    name="position"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Position / Title
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter your position..."
                                                    {...field}
                                                    value={field.value || ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={detailsForm.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    rows={4}
                                                    placeholder="Describe yourself..."
                                                    {...field}
                                                    value={field.value || ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={detailsForm.control}
                                    name="publicEmail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Displayed email address
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="Enter your email..."
                                                    {...field}
                                                    value={field.value || ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={detailsForm.control}
                                    name="website"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Displayed website
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="url"
                                                    placeholder="Enter your website URL..."
                                                    {...field}
                                                    value={field.value || ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={detailsForm.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Displayed phone number
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="tel"
                                                    placeholder="Enter your phone number..."
                                                    {...field}
                                                    value={field.value || ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div>
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
                                </div>
                            </SettingsBoxForm>
                        </form>
                    </Form>
                </SettingsBoxContent>
            </SettingsFormBox>

            <SettingsFormBox>
                <SettingsFormTitle>Profile picture</SettingsFormTitle>
                <SettingsFormDescription>
                    Update your profile picture.
                </SettingsFormDescription>
                <SettingsBoxContent>
                    <Form {...profilePictureForm}>
                        <form
                            onSubmit={profilePictureForm.handleSubmit(
                                onProfilePictureSubmit
                            )}
                            onReset={onProfilePictureReset}
                        >
                            <SettingsBoxForm>
                                <SettingsBoxFormElement>
                                    <FormField
                                        control={profilePictureForm.control}
                                        name="profilePicture"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Current profile picture
                                                </FormLabel>
                                                <Avatar
                                                    className={
                                                        "w-32 h-32 my-2 hover:brightness-75 transition-all cursor-pointer"
                                                    }
                                                >
                                                    {user.profilePictureUrl ? (
                                                        <AvatarImage
                                                            className={
                                                                "object-cover"
                                                            }
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
                                                                      ?.charAt(
                                                                          0
                                                                      )
                                                                      .toUpperCase() +
                                                                  user.lastName
                                                                      ?.charAt(
                                                                          0
                                                                      )
                                                                      .toUpperCase()
                                                                : "N/A"}
                                                        </AvatarFallback>
                                                    )}
                                                </Avatar>
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        onChange={(e) => {
                                                            const file =
                                                                e.target
                                                                    .files?.[0] ||
                                                                null;
                                                            if (!file) {
                                                                return;
                                                            }
                                                            // update RHF with the actual File object
                                                            field.onChange(
                                                                file
                                                            );
                                                            profilePictureForm.setValue(
                                                                "profilePicture",
                                                                file
                                                            );
                                                            // run validation right away
                                                            profilePictureForm.trigger(
                                                                "profilePicture"
                                                            );
                                                        }}
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
                                    </SettingsFormButtonGroup>
                                </SettingsBoxFormElement>
                            </SettingsBoxForm>
                        </form>
                    </Form>
                </SettingsBoxContent>
            </SettingsFormBox>

            <SettingsFormBox>
                <SettingsFormTitle>Change email address</SettingsFormTitle>
                <SettingsFormDescription>
                    Update your account&apos;s email address.
                </SettingsFormDescription>
                <SettingsBoxContent>
                    <SettingsBoxForm>
                        <SettingsBoxFormElement>
                            <Label>Current email address</Label>
                            <Input
                                disabled={true}
                                type="email"
                                placeholder="Enter your email address"
                                value={user.email}
                            />
                        </SettingsBoxFormElement>
                        <SettingsBoxFormElement>
                            <Label>New email address</Label>
                            <Input
                                disabled={true}
                                type="email"
                                placeholder="Enter your email address"
                            />
                        </SettingsBoxFormElement>
                        <SettingsFormButtonGroup>
                            <Button
                                variant={"default"}
                                className={"w-fit"}
                                disabled
                            >
                                Apply
                            </Button>
                        </SettingsFormButtonGroup>
                    </SettingsBoxForm>
                </SettingsBoxContent>
            </SettingsFormBox>

            <SettingsFormBox>
                <SettingsFormTitle>Change password</SettingsFormTitle>
                <SettingsFormDescription>
                    Update your account&apos;s password.
                </SettingsFormDescription>
                <SettingsBoxContent>
                    <SettingsBoxForm>
                        <SettingsBoxFormElement>
                            <Label>Current password</Label>
                            <Input
                                disabled={true}
                                type="password"
                                placeholder="Enter your password"
                            />
                        </SettingsBoxFormElement>
                        <SettingsBoxFormElement>
                            <Label>New password</Label>
                            <Input
                                disabled={true}
                                type="password"
                                placeholder="Enter your new password"
                            />
                        </SettingsBoxFormElement>
                        <SettingsBoxFormElement>
                            <Label>Confirm new password</Label>
                            <Input
                                disabled={true}
                                type="email"
                                placeholder="Enter your email address"
                            />
                        </SettingsBoxFormElement>
                        <SettingsFormButtonGroup>
                            <Button
                                variant={"default"}
                                className={"w-fit"}
                                disabled
                            >
                                Apply
                            </Button>
                        </SettingsFormButtonGroup>
                    </SettingsBoxForm>
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
                        className={"w-fit"}
                        variant={"secondary_custom"}
                        pressed={debug}
                        onPressedChange={(value) => dispatch(setDebug(value))}
                    >
                        {debug ? "Debug mode: ON" : "Debug mode: OFF"}
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
