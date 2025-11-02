"use server";

import { auth } from "@/lib/auth/betterauth/auth";
import { changePasswordFormSchema, resetPasswordFormSchema, signUpFormSchema } from "@/types/form-schemas/auth-form-schemas";
import { headers } from "next/headers";
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


        return { success: true, error: null, response: response };
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error",
        );
    }
};

export const resetPasswordDTO = async (formData: FormData) => {
    try {
        const data = Object.fromEntries(formData);
        const result = resetPasswordFormSchema.safeParse(data);
        if (!result.success) {
            throw new Error(JSON.stringify(z.flattenError(result.error)));
        }
        const validatedData = result.data;
        const apiResponse = await auth.api.resetPassword({
            body: {
                newPassword: validatedData.password,
                token: validatedData.token,
            },
        });
        console.log("reset password email sent: ", apiResponse);
        return { success: true, error: null };
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error",
        );
    }
}

export const changePasswordDTO = async (formData: FormData) => {
    try {
        const data = Object.fromEntries(formData);
        const result = changePasswordFormSchema.safeParse(data);
        if (!result.success) {
            throw new Error(JSON.stringify(z.flattenError(result.error)));
        }
        const validatedData = result.data;
        const apiResponse = await auth.api.changePassword({
            body: {
                currentPassword: validatedData.password,
                newPassword: validatedData.newPassword,
                revokeOtherSessions: true,
            },
            headers: await headers(),
        });
        console.log("password updated: ", apiResponse);
        return { success: true, error: null, response: apiResponse };
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error",
        );
    }
}
