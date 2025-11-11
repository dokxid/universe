"use client";

import {
    triggerRevalidatePathAction,
    triggerRevalidateTagAction,
} from "@/actions/cache";
import { inviteSuperAdminAction } from "@/actions/form/invite-member";
import { removeUserAction } from "@/actions/mutate/mutate-user";
import { initDatabaseAction, seedDatabaseAction } from "@/actions/seed";
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
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handleFormErrors } from "@/lib/utils/form-error-handling";
import { inviteSuperAdminFormSchema, removeUserFormSchema } from "@/types/form-schemas/user-form-schemas";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export function DebugSettings() {
    const [numStories, setNumStories] = useState(40);
    const [numCityCenters, setNumCityCenters] = useState(5);

    const inviteSuperAdminForm = useForm<z.infer<typeof inviteSuperAdminFormSchema>>({
        defaultValues: {
            email: "",
        },
    });

    const removeUserForm = useForm<z.infer<typeof removeUserFormSchema>>({
        defaultValues: {
            userId: "",
        },
    });

    const onInviteSuperAdminFormSubmit = async (data: z.infer<typeof inviteSuperAdminFormSchema>) => {
        try {
            const formData = new FormData();
            formData.append("email", data.email);
            const result = await inviteSuperAdminAction(formData);
            if (result?.success) {
                toast.success(`Invited ${data.email} successfully!`);
                return;
            }
            if (result?.error) {
                handleFormErrors(result, inviteSuperAdminForm);
            }
        } catch (error) {
            toast.error("Failed to invite super admin");
            console.error(error);
        }
    }

    const onRemoveUserFormSubmit = async (data: z.infer<typeof removeUserFormSchema>) => {
        try {
            const formData = new FormData();
            formData.append("userId", data.userId);
            const result = await removeUserAction(formData);
            if (result?.success) {
                toast.success(`Removed ${data.userId} successfully!`);
                return;
            }
            if (result?.error) {
                handleFormErrors(result, inviteSuperAdminForm);
            }
        } catch (error) {
            toast.error("Failed to invite super admin");
            console.error(error);
        }
    }
    return (
        <SettingsLayout>
            <SettingsFormBox>
                <SettingsFormTitle>Revalidation</SettingsFormTitle>
                <SettingsFormDescription>
                    Revalidate paths and tags in the Next.js cache.
                </SettingsFormDescription>
                <SettingsBoxContent>
                    <SettingsFormButtonGroup>
                        <Button
                            className={"w-full md:w-fit"}
                            onClick={() => {
                                try {
                                    triggerRevalidatePathAction("/[slug]/map");
                                    triggerRevalidatePathAction(
                                        "/[slug]/stories",
                                    );
                                    triggerRevalidatePathAction(
                                        "/[slug]/labs",
                                    );
                                    triggerRevalidatePathAction(
                                        "/[slug]/users",
                                    );
                                    triggerRevalidatePathAction(
                                        "/[slug]/account/user-preferences",
                                    );
                                    toast.success(
                                        "Path revalidation successful",
                                    );
                                } catch (error) {
                                    toast.error("Path revalidation failed");
                                    console.error(error);
                                }
                            }}
                        >
                            Revalidate Paths
                        </Button>
                        <Button
                            className={"w-full md:w-fit"}
                            onClick={() => {
                                try {
                                    triggerRevalidateTagAction(
                                        "labs",
                                    ).then(() => {
                                        toast.success(
                                            "Heritage Lab revalidation successful",
                                        );
                                    });
                                    triggerRevalidateTagAction("stories").then(
                                        () => {
                                            toast.success(
                                                "Story revalidation successful",
                                            );
                                        },
                                    );
                                    triggerRevalidateTagAction("tags").then(
                                        () => {
                                            toast.success(
                                                "Tag revalidation successful",
                                            );
                                        },
                                    );
                                    triggerRevalidateTagAction("users").then(
                                        () => {
                                            toast.success(
                                                "User revalidation successful",
                                            );
                                        },
                                    );
                                } catch (error) {
                                    toast.error("Tag revalidation failed");
                                    console.error(error);
                                }
                            }}
                        >
                            Revalidate Tags
                        </Button>
                    </SettingsFormButtonGroup>
                </SettingsBoxContent>
            </SettingsFormBox>
            <SettingsFormBox>
                <SettingsFormTitle>Invite Super Admin</SettingsFormTitle>
                <SettingsFormDescription>
                    Invite a new super admin in the authentication system.
                </SettingsFormDescription>
                <SettingsBoxContent>
                    <Form {...inviteSuperAdminForm}>
                        <form onSubmit={inviteSuperAdminForm.handleSubmit(onInviteSuperAdminFormSubmit)}>
                            <SettingsBoxForm>
                                <FormField
                                    control={inviteSuperAdminForm.control}
                                    name={"email"}
                                    render={({ field }) => (
                                        <SettingsBoxFormElement>
                                            <Label className={""}>Email of invitee</Label>
                                            <Input
                                                className={"max-w-full"}
                                                placeholder="Email"
                                                type="email"
                                                {...field}
                                            />
                                        </SettingsBoxFormElement>
                                    )} />
                                <SettingsFormButtonGroup>
                                    <Button className={"w-full md:w-fit"}>
                                        Invite
                                    </Button>
                                </SettingsFormButtonGroup>
                            </SettingsBoxForm>
                        </form>
                    </Form>
                </SettingsBoxContent>
            </SettingsFormBox>
            <SettingsFormBox>
                <SettingsFormTitle>Remove user</SettingsFormTitle>
                <SettingsFormDescription>
                    Remove a user from the system.
                </SettingsFormDescription>
                <SettingsBoxContent>
                    <Form {...removeUserForm}>
                        <form onSubmit={removeUserForm.handleSubmit(onRemoveUserFormSubmit)}>
                            <SettingsBoxForm>
                                <FormField
                                    control={removeUserForm.control}
                                    name={"userId"}
                                    render={({ field }) => (
                                        <SettingsBoxFormElement>
                                            <Label className={""}>User ID of entity to kick</Label>
                                            <Input
                                                className={"max-w-full"}
                                                placeholder="User ID"
                                                type="text"
                                                {...field}
                                            />
                                        </SettingsBoxFormElement>
                                    )} />
                                <SettingsFormButtonGroup>
                                    <Button className={"w-full md:w-fit"} variant={"destructive"}>
                                        Remove User
                                    </Button>
                                </SettingsFormButtonGroup>
                            </SettingsBoxForm>
                        </form>
                    </Form>
                </SettingsBoxContent>
            </SettingsFormBox>
            <SettingsFormBox>
                <SettingsFormTitle>Seed / Reset Database</SettingsFormTitle>
                <SettingsFormDescription>
                    Reset and seed the entire database with the stock Heritage
                    Lab data and add a new test labs under /test/map with
                    the given amount of random generated stories.
                    <br /><br /><b>PREPARE WITH CAUTION</b>
                </SettingsFormDescription>
                <SettingsBoxContent>
                    <SettingsBoxForm>
                        <SettingsBoxFormElement>
                            <Label className={""}>
                                Number of random cities to create in test
                                lab
                            </Label>
                            <Input
                                className={"max-w-full"}
                                placeholder="Number of random cities"
                                type="number"
                                value={numCityCenters}
                                min={1}
                                max={1000}
                                step={1}
                                onChange={(e) =>
                                    setNumCityCenters(Number(e.target.value))
                                }
                            />
                        </SettingsBoxFormElement>
                        <SettingsBoxFormElement>
                            <Label className={""}>
                                Number of stories to create in test lab
                            </Label>
                            <Input
                                className={"max-w-full"}
                                placeholder="Number of stories"
                                type="number"
                                value={numStories}
                                min={1}
                                max={1000}
                                step={1}
                                onChange={(e) =>
                                    setNumStories(Number(e.target.value))
                                }
                            />
                        </SettingsBoxFormElement>
                    </SettingsBoxForm>
                    <SettingsFormButtonGroup>
                        <Button
                            variant={"destructive"}
                            onClick={async () => {
                                try {
                                    const result = await seedDatabaseAction(
                                        numCityCenters,
                                        numStories,
                                    );
                                    if (result?.success) {
                                        toast.success(
                                            "Database seeding successful",
                                        );
                                    }
                                    if (result?.error) {
                                        toast.error(
                                            "Database seeding failed: " +
                                            result.error,
                                        );
                                    }
                                } catch (error) {
                                    toast.error("Database seeding failed");
                                    console.error(error);
                                }
                            }}
                        >
                            Seed Database
                        </Button>
                        <Button
                            variant={"destructive"}
                            onClick={async () => {
                                try {
                                    const result = await initDatabaseAction()
                                    if (result?.success) {
                                        toast.success(
                                            "Database initialization successful",
                                        );
                                    }
                                    if (result?.error) {
                                        toast.error(
                                            "Database initialization failed: " +
                                            result.error,
                                        );
                                    }
                                } catch (error) {
                                    toast.error("Database seeding failed");
                                    console.error(error);
                                }
                            }}
                        >
                            Reset Database to Minimal State
                        </Button>
                    </SettingsFormButtonGroup>
                </SettingsBoxContent>
            </SettingsFormBox>
        </SettingsLayout >
    );
}
