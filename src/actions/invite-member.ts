"use server";

import { sendInvitation } from "@/lib/auth/workos/invitation";
import { inviteMemberSchema } from "@/types/form-schemas";
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
        await sendInvitation(validatedData.data.email, validatedData.data.slug);
        return { success: true };
    } catch (error) {
        console.error("Error inviting member:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}
