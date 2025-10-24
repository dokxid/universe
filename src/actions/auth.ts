"use server";

import { auth } from "@/lib/auth/betterauth/auth";
import { LoginFormSchema } from "@/types/form-schemas/auth-form-schemas";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

export async function logInAction(formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const result = LoginFormSchema.safeParse(rawData);
        if (!result.success) {
            throw new Error(JSON.stringify(z.flattenError(result.error)));
        }
        const data = result.data;
        const response = await auth.api.signInEmail({
            body: {
                email: data.email,
                password: data.password,
                rememberMe: data.rememberMe,
                callbackURL: `/${data.slug}/map`,
            },
            asResponse: true,
        });
        return response;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

export async function signOutAction() {
    try {
        await auth.api.signOut({
            headers: await headers(),
        });
    } catch (error) {
        console.error("Failed to sign out:", error);
    }
    redirect(`http://localhost:3000/universe/login`);
}
