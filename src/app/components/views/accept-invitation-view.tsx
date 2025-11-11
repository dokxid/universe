"use client";

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
import { LoginForm } from "../form/auth-forms/login-form";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AcceptInvitationView({
    invitation,
}: {
    invitation: InvitationDTO;
}) {
    const { user, isLoading, isError } = useCurrentUser(false);
    const isMobile = useIsMobile();
    const router = useRouter();
    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError) {
        return <div>Error loading user data.</div>;
    }
    const isGuest = user === null;
    const handleAcceptInvitation = async () => {
        try {
            await acceptInvitationAction(invitation.id);
            toast.success("Successfully joined the lab!");
            router.push(`/${invitation.lab.slug}`);
        } catch (error) {
            if (error instanceof Error) {
                toast.error("Failed to join lab: " + error.message);
            }
        }
    };
    return (
        <div className={"flex flex-col md:flex-row w-full max-w-4xl space-y-8"}>
            {isGuest && (
                <>
                    <div className={"w-full grow"}>
                        <LoginForm />
                    </div>
                    <Separator
                        orientation={"vertical"}
                        className={isMobile ? "hidden " : "" + "mx-8"}
                    />
                    ,
                </>
            )}
            <Card className={"w-full max-w-sm"}>
                <HostedImage
                    fileName={invitation.lab.logo}
                    alt={invitation.lab.name + " Logo"}
                />
                <CardHeader>
                    <CardTitle>Accept Invitation</CardTitle>
                    <CardDescription>
                        You have been invited by{" "}
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
                        onClick={() => handleAcceptInvitation()}
                        disabled={isGuest}
                        className={"btn btn-primary"}
                    >
                        {isGuest ? "Sign up and join Lab" : "Join Lab"}
                    </Button>
                </CardContent>
                {/* <DebugListObject data={invitation} /> */}
            </Card>
        </div>
    );
}
