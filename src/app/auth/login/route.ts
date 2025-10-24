import { auth } from "@/lib/auth/betterauth/auth";
import { getRedirectUri, workos } from "@/lib/auth/workos/callback";
import { LoginFormSchema } from "@/types/form-schemas/auth-form-schemas";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import z from "zod";

export const POST = async (request: NextRequest) => {
    try {
        const formData = await request.formData();
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
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

export const GET = async () => {
    const headersList = await headers();
    const refererHeader = headersList.get("referer");
    const redirectUri = getRedirectUri();

    let originatingUrl = "/";

    if (refererHeader) {
        try {
            const refererUrl = new URL(refererHeader);
            originatingUrl = refererUrl.pathname + refererUrl.search;
        } catch (error) {
            console.error("Invalid referer URL:", error);
        }
    }

    // for some reason i need to base64 encode the redirect url otherwise it fails
    const stateObject = {
        returnPathname: originatingUrl,
    };
    const jsonString = JSON.stringify(stateObject);
    const encodedState = btoa(jsonString);

    const authorizationUrl = workos.userManagement.getAuthorizationUrl({
        provider: "authkit",
        screenHint: "sign-in",
        redirectUri: redirectUri,
        clientId: process.env.WORKOS_CLIENT_ID!,
        state: encodedState,
    });

    return redirect(authorizationUrl);
};
