"use client";

import { DebugListObject } from "../cards/debug-list-object";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { acceptInvitationAction } from "@/actions/accept-invitation";
import { InvitationDTO } from "@/types/dtos";
import { Button } from "@/components/ui/button";
import { HostedImage } from "../embeds/s3-image";
import { useCurrentUser } from "@/lib/swr/user-hook";
import Link from "next/link";

export function AcceptInvitationView({
    invitation,
}: {
    invitation: InvitationDTO;
}) {
    const { user, isLoading, isError } = useCurrentUser(false);
    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError) {
        return <div>Error loading user data.</div>;
    }
    const isGuest = user === null;
    return (
        <>
            <Card>
                <HostedImage
                    fileName={invitation.lab.logo}
                    alt={invitation.lab.name + " Logo"}
                />
                <CardHeader>
                    <CardTitle>Accept Invitation</CardTitle>
                    <CardDescription>
                        You have been by{" "}
                        <Link
                            href={`/${invitation.lab.slug}/user/view/${invitation.inviter.id}`}
                            className={"link-internal font-bold"}
                        >
                            {invitation.inviter.name}
                        </Link>{" "}
                        invited to join the lab {invitation.lab.name}.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        onClick={() => acceptInvitationAction(invitation.id)}
                        className={"btn btn-primary"}
                    >
                        {isGuest ? "Sign up and join Lab" : "Join Lab"}
                    </Button>
                </CardContent>
            </Card>
            <DebugListObject data={invitation} />
        </>
    );
}
