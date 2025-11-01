"use server";

import { auth } from "@/lib/auth/betterauth/auth";
import { prisma } from "@/lib/data/prisma/connections";
import { inviteMemberSchema } from "@/types/form-schemas/invite-member-form-schemas";
import { APIError } from "better-auth";
import { headers } from "next/headers";
import z from "zod";

export async function inviteMemberAction(formData: FormData) {
    try {
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
