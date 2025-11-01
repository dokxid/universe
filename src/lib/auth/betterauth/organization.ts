import "server-only";

import { prisma } from "@/lib/data/prisma/connections";
import { APIError } from "better-auth";
import { headers } from "next/headers";
import { auth } from "./auth";

export const removeLabMember = async (userId: string | null, labId: string) => {
    try {
        if (!userId)
            throw new Error(
                "User email is required to remove member from organization."
            );
        console.debug(`Removing member ${userId} from organization ${labId}`);
        const memberId = await prisma.member.findUnique({
            where: {
                labId_userId: {
                    labId: labId,
                    userId: userId,
                },
            },
            select: {
                id: true,
            },
        });
        if (!memberId) throw new Error("Member not found in organization.");
        console.debug(`Found member ID: ${memberId.id}`);
        const data = await auth.api.removeMember({
            body: {
                memberIdOrEmail: memberId.id,
                organizationId: labId,
            },
            headers: await headers(),
        });
        console.log(JSON.stringify(data, null, 2));
        return data;
    } catch (error) {
        console.error("Error removing organization member:", error);
        throw new Error(
            error instanceof APIError
                ? JSON.stringify(error.body)
                : error instanceof Error
                ? error.message
                : "Unknown error"
        );
    }
};
