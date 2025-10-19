"use client";

import { inviteMemberAction } from "@/actions/form/invite-member";
import {
    SettingsBoxContent,
    SettingsBoxFormElement,
} from "@/app/components/layout/content-layout";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inviteMemberSchema } from "@/types/form-schemas/invite-member-form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export function InviteMemberDialog({ slug }: { slug: string }) {
    const inviteMemberForm = useForm<z.infer<typeof inviteMemberSchema>>({
        resolver: zodResolver(inviteMemberSchema),
        defaultValues: { email: "", slug: slug },
    });
    const onSubmit = async (data: z.output<typeof inviteMemberSchema>) => {
        const formdata = new FormData();
        formdata.append("email", data.email);
        formdata.append("slug", data.slug);
        await inviteMemberAction(formdata)
            .then(() => {
                toast.success("Successfully sent an invite to: " + data.email);
                inviteMemberForm.reset();
            })
            .catch((e) => {
                toast.error("Failed to send invite: " + e.message);
            });
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"secondary_custom"} className={""}>
                    <UserPlus />
                    Invite member
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite a new member</DialogTitle>
                    <DialogDescription>
                        Invite a new member to your lab by entering their email
                        address. They will receive an invitation to join your
                        lab.
                    </DialogDescription>
                </DialogHeader>
                <Form {...inviteMemberForm}>
                    <form onSubmit={inviteMemberForm.handleSubmit(onSubmit)}>
                        <SettingsBoxContent>
                            <FormField
                                control={inviteMemberForm.control}
                                name="email"
                                render={({ field }) => (
                                    <SettingsBoxFormElement>
                                        <Label
                                            htmlFor="email"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Email
                                        </Label>
                                        <Input
                                            type="email"
                                            required={true}
                                            placeholder="Enter email address"
                                            {...field}
                                        />
                                    </SettingsBoxFormElement>
                                )}
                            />
                            <FormField
                                control={inviteMemberForm.control}
                                name="slug"
                                render={({ field }) => (
                                    <SettingsBoxFormElement>
                                        <Label
                                            htmlFor="email"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Lab
                                        </Label>
                                        <Input
                                            disabled={true}
                                            type="text"
                                            required={true}
                                            placeholder="Enter lab name"
                                            {...field}
                                        />
                                    </SettingsBoxFormElement>
                                )}
                            />
                            <SettingsBoxFormElement>
                                <Button type="submit" className="w-full">
                                    Send Invite
                                </Button>
                            </SettingsBoxFormElement>
                        </SettingsBoxContent>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
