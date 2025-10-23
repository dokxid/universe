"use server";

import { auth } from "@/lib/auth/betterauth/auth";
import { signUpFormSchema } from "@/types/form-schemas/auth-form-schemas";
import z from "zod";

export const signUpDTO = async (formData: FormData) => {
    try {
        const rawData = Object.fromEntries(formData);
        const result = signUpFormSchema.safeParse(rawData);
        if (!result.success) {
            throw new Error(JSON.stringify(z.flattenError(result.error)));
        }
        const data = result.data;
        const response = await auth.api.signUpEmail({
            body: {
                email: data.email,
                password: data.password,
                name: data.displayName || "Anonymous",
                callbackURL: `/${data.labSlug}`,
            },
        });
        console.log("user created: ", response);

        return { success: true, error: null };
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
};
