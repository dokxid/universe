"use server";

import { PrismaClient } from "@/generated/prisma/client";
import { auth } from "@/lib/auth/betterauth/auth";
import { inviteMemberSchema } from "@/types/form-schemas/invite-member-form-schemas";
import z from "zod";

export async function inviteMemberAction(formData: FormData) {
    try {
        const validatedData = inviteMemberSchema.safeParse({
            email: formData.get("email"),
            slug: formData.get("slug"),
        });
        if (!validatedData.success) {
            return {
                errors: z.treeifyError(validatedData.error),
            };
        }
        const prisma = new PrismaClient();
        const lab = await prisma.lab.findUnique({
            where: { slug: validatedData.data.slug },
        });
        if (!lab) {
            throw new Error("Lab not found");
        }
        await auth.api.createInvitation({
            body: {
                email: validatedData.data.email,
                role: "member",
                organizationId: lab.id,
                resend: true,
            },
        });
        return { success: true };
    } catch (error) {
        console.error("Error inviting member:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}
