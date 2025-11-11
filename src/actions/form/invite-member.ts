"use server";

import { canInviteMembersToLab, canInviteSuperAdmins } from "@/data/dto/auth/user-permissions";
import { auth } from "@/lib/auth/betterauth/auth";
import { prisma } from "@/lib/data/prisma/connections";
import { inviteMemberSchema } from "@/types/form-schemas/invite-member-form-schemas";
import { inviteSuperAdminFormSchema } from "@/types/form-schemas/user-form-schemas";
import { APIError } from "better-auth";
import { headers } from "next/headers";
import z from "zod";

export async function inviteMemberAction(formData: FormData) {
    try {
        const permission = await canInviteMembersToLab(formData.get("slug") as string);
        if (!permission) {
            throw new Error("You do not have permission to invite members to this lab");
        }
        const validatedData = inviteMemberSchema.safeParse({
            email: formData.get("email"),
            slug: formData.get("slug"),
        });
        if (!validatedData.success) {
            return {
                errors: z.flattenError(validatedData.error),
            };
        }
        console.log(
            "Inviting member to lab with slug:",
            validatedData.data.slug,
        );
        const lab = await prisma.lab.findUnique({
            where: { slug: validatedData.data.slug },
        });
        if (!lab) {
            throw new Error("Lab not found");
        }
        const result = await auth.api.createInvitation({
            body: {
                email: validatedData.data.email,
                role: "member",
                organizationId: lab.id,
                resend: true,
            },
            headers: await headers(),
        });
        console.log("Invitation result:", result);
        return { success: true };
    } catch (error) {
        if (error instanceof APIError)
            console.log("Login response:", JSON.stringify(error.body));
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : error instanceof APIError
                        ? JSON.stringify(error.body)
                        : "Unknown error",
        };
    }
}

export async function inviteSuperAdminAction(formData: FormData) {
    try {
        const permissions = canInviteSuperAdmins();
        if (!permissions) {
            throw new Error("You do not have permission to invite super admins");
        }
        const validatedData = inviteSuperAdminFormSchema.safeParse({
            email: formData.get("email"),
        });
        if (!validatedData.success) {
            return {
                errors: z.flattenError(validatedData.error),
            };
        }
        try {
            const result = await auth.api.createUser({
                body: {
                    email: validatedData.data.email,
                    password: crypto.randomUUID(),
                    name: "Anoymous",
                    role: "admin",
                },
                headers: await headers(),
            });
            console.debug("User creation result:", result);
        } catch (error) {
            if (
                error instanceof APIError &&
                error.status === 409
            ) {
                console.log(
                    "User already exists, proceeding to send password reset email.",
                );
            }
        }
        const invitation = await auth.api.requestPasswordReset({
            body: {
                email: validatedData.data.email,
            },
            headers: await headers(),
        });
        console.debug("Invitation result:", invitation);
        return { success: true };
    } catch (error) {
        if (error instanceof APIError)
            console.log("Login response:", JSON.stringify(error.body));
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : error instanceof APIError
                        ? JSON.stringify(error.body)
                        : "Unknown error",
        };
    }
}
