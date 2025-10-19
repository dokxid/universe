import { getSlugFromOrganizationIdDTO } from "@/data/dto/getters/get-experience-dto";
import { AuthException } from "@/types/workos-errors";
import { WorkOS } from "@workos-inc/node";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const workos = new WorkOS(process.env.WORKOS_API_KEY!, {
    clientId: process.env.WORKOS_CLIENT_ID!,
});

export const GET = async (req: NextRequest) => {
    const code = req.nextUrl.searchParams.get("code");
    const state = req.nextUrl.searchParams.get("state") || "/";

    if (!code) {
        return NextResponse.redirect(new URL("/universe/login", req.url));
    }

    try {
        const { organizationId, sealedSession } =
            await workos.userManagement.authenticateWithCode({
                clientId: process.env.WORKOS_CLIENT_ID!,
                code: code,
                session: {
                    sealSession: true,
                    cookiePassword: process.env.WORKOS_COOKIE_PASSWORD!,
                },
            });

        // Ensure sealedSession is present before using it (narrows type to string)
        if (!sealedSession) {
            console.error(
                "No sealed session returned from WorkOS authentication"
            );
            return NextResponse.redirect(
                new URL("/universe/login?error=no_session", req.url)
            );
        }

        const cookieStore = await cookies();
        cookieStore.set({
            name: "wos-session",
            value: sealedSession,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });

        if (!organizationId) {
            return NextResponse.redirect(new URL(state, req.url));
        }

        const slug = await getSlugFromOrganizationIdDTO(organizationId);
        const redirectUrl = slug ? `/${slug}/map` : "/universe/map";
        return NextResponse.redirect(new URL(redirectUrl, req.url));
    } catch (error) {
        if (!(error instanceof Error)) {
            throw error;
        }
        if ("rawData" in error && "code" in (error as AuthException).rawData) {
            const authError = error as AuthException;
            if (authError.rawData.code === "organization_selection_required") {
                // Store in cookies
                const response = NextResponse.redirect(
                    new URL("/universe/login", req.url)
                );
                response.cookies.set(
                    "pendingAuthToken",
                    authError.rawData.pending_authentication_token,
                    {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        maxAge: 600, // 10 minutes
                        sameSite: "lax",
                    }
                );
                response.cookies.set(
                    "organizations",
                    JSON.stringify(authError.rawData.organizations),
                    {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        maxAge: 600,
                        sameSite: "lax",
                    }
                );
                return response;
            }
        }
        console.error("Callback error:", error);
        return NextResponse.redirect(
            new URL("/universe/login?error=auth_failed", req.url)
        );
    }
};
