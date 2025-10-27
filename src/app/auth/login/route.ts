import { auth } from "@/lib/auth/betterauth/auth";
import { loginFormSchema } from "@/types/form-schemas/auth-form-schemas";
import { NextRequest } from "next/server";
import z from "zod";

export const POST = async (request: NextRequest) => {
    try {
        const formData = await request.formData();
        const rawData = Object.fromEntries(formData.entries());
        const result = loginFormSchema.safeParse(rawData);
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
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
