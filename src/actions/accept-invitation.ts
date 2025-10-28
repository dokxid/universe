"use server";

import { auth } from "@/lib/auth/betterauth/auth";

export const acceptInvite = async (invitationId: string) => {
    try {
        const acceptInvitationResult = await auth.api.acceptInvitation({
            body: {
                invitationId: invitationId,
            },
        });
        if (!acceptInvitationResult) {
            throw new Error("Failed to accept invitation.");
        }
        return acceptInvitationResult;
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error",
        );
    }
};

export const acceptInvitationAction = async (invitationId: string) => {
    try {
        return await acceptInvite(invitationId);
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error",
        );
    }
};
