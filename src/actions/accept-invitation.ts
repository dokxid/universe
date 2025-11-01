"use server";

import { auth } from "@/lib/auth/betterauth/auth";
import { APIError } from "better-auth";
import { headers } from "next/headers";

export const acceptInvite = async (invitationId: string) => {
    try {
        console.log("Accepting invitation with ID: ", invitationId);
        const acceptInvitationResult = await auth.api.acceptInvitation({
            body: {
                invitationId: invitationId,
            },
            headers: await headers(),
        });
        console.log("Invitation accepted: ", acceptInvitationResult);
        if (!acceptInvitationResult) {
            throw new Error("Failed to accept invitation.");
        }
        return acceptInvitationResult;
    } catch (error) {
        throw new Error(
            error instanceof Error
                ? error.message
                : error instanceof APIError
                  ? JSON.stringify(error.body)
                  : "Unknown error",
        );
    }
};

export const acceptInvitationAction = async (invitationId: string) => {
    try {
        return await acceptInvite(invitationId);
    } catch (error) {
        throw new Error(
            error instanceof Error
                ? error.message
                : error instanceof APIError
                  ? JSON.stringify(error.body)
                  : "Unknown error",
        );
    }
};
