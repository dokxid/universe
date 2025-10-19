"use server";

import { getSlugsFromOrganizationIdDTO } from "@/data/dto/getters/get-experience-dto";
import {
    SSORequiredException,
    type AuthException,
} from "@/types/workos-errors";
import { WorkOS } from "@workos-inc/node";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

if (!process.env.WORKOS_API_KEY) {
    throw new Error("WORKOS_API_KEY is not set");
}
if (!process.env.WORKOS_CLIENT_ID) {
    throw new Error("WORKOS_CLIENT_ID is not set");
}
if (!process.env.WORKOS_COOKIE_PASSWORD) {
    throw new Error("WORKOS_COOKIE_PASSWORD is not set");
}
if (!process.env.WORKOS_LOGOUT_URI) {
    throw new Error("WORKOS_LOGOUT_URI is not set");
}
const workos = new WorkOS(process.env.WORKOS_API_KEY!, {
    clientId: process.env.WORKOS_CLIENT_ID!,
});

async function logInNormal(formData: FormData) {
    try {
        const { organizationId, sealedSession } =
            await workos.userManagement.authenticateWithPassword({
                clientId: process.env.WORKOS_CLIENT_ID!,
                email: String(formData.get("email")),
                password: String(formData.get("password")),
                session: {
                    sealSession: true,
                    cookiePassword: process.env.WORKOS_COOKIE_PASSWORD!,
                },
            });
        return { organizationId, sealedSession };
    } catch (error) {
        throw error as AuthException;
    }
}

async function logInOrganizationSelection(formData: FormData) {
    try {
        const { organizationId, sealedSession } =
            await workos.userManagement.authenticateWithOrganizationSelection({
                clientId: process.env.WORKOS_CLIENT_ID!,
                pendingAuthenticationToken: String(
                    formData.get("pendingAuthToken")
                ),
                organizationId: String(formData.get("organizationId")),
                session: {
                    sealSession: true,
                    cookiePassword: process.env.WORKOS_COOKIE_PASSWORD!,
                },
            });
        return { organizationId, sealedSession };
    } catch (error) {
        throw error;
    }
}

export async function logInAction(formData: FormData) {
    const cookieStore = await cookies();
    try {
        let organizationId, sealedSession;
        if (formData.get("pendingAuthToken")) {
            ({ organizationId, sealedSession } =
                await logInOrganizationSelection(formData));
        } else {
            ({ organizationId, sealedSession } = await logInNormal(formData));
        }
        if (sealedSession === undefined) {
            throw new Error("Failed to authenticate");
        }
        cookieStore.set({
            name: "wos-session",
            value: sealedSession,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });
        if (!organizationId) {
            redirect("/");
        }
        const slugs = await getSlugsFromOrganizationIdDTO(organizationId);
        if (!slugs) {
            throw new Error(
                `Could not find slugs for organization ID: ${organizationId}`
            );
        }
        const isTest = slugs.includes("test");
        cookieStore.delete("pendingAuthToken");
        cookieStore.delete("organizations");
        return {
            redirectUrl: isTest
                ? "/test/map"
                : slugs
                ? `/${slugs[0]}/map`
                : "/universe/map",
        };
    } catch (error) {
        // this looks so ugly jesus christ
        console.error("Login error:", error);
        console.error("Raw data:", (error as AuthException).rawData);
        if (!(error instanceof Error)) {
            return {
                email: "An unexpected error occurred.",
                password: "Please try again later.",
            };
        }
        if ("rawData" in error && "code" in (error as AuthException).rawData) {
            const authError = error as AuthException;
            switch (authError.rawData.code) {
                case "organization_selection_required":
                    return {
                        organizationId: "Please select an organization.",
                        pendingAuthToken:
                            authError.rawData.pending_authentication_token,
                        organizations: authError.rawData.organizations,
                    };
                case "invalid_pending_authentication_token":
                    cookieStore.delete("pendingAuthToken");
                    return {
                        pendingAuthToken:
                            "Your session has expired. Please log in again.",
                    };
                case "invalid_grant":
                    return {
                        email: "Invalid email or password.",
                        password: "Please check your password",
                    };
                default:
                    return {
                        email: "unknown error occurred. please contact the admins.",
                        password:
                            "unknown error occurred. please contact the admins.",
                    };
            }
        }
        if (
            (error as unknown as SSORequiredException).error === "sso_required"
        ) {
            const url = workos.sso.getAuthorizationUrl({
                clientId: process.env.WORKOS_CLIENT_ID!,
                connection: (error as unknown as SSORequiredException).rawData
                    .connection_ids[0],
                redirectUri:
                    process.env.WORKOS_SSO_REDIRECT_URI ||
                    "http://localhost:3000/auth/callback",
                loginHint: (error as unknown as SSORequiredException).rawData
                    .email,
            });
            redirect(url);
        }
    }
}

export async function signOutAction() {
    let logoutUrl = "";
    let returnTo = "";
    try {
        const cookieStorage = await cookies();
        const sessionId = cookieStorage.get("wos-session")?.value || "";
        returnTo = process.env.WORKOS_LOGOUT_URI || `http://localhost:3000/`;
        const session = await workos.userManagement.loadSealedSession({
            sessionData: sessionId,
            cookiePassword: process.env.WORKOS_COOKIE_PASSWORD!,
        });
        cookieStorage.delete("wos-session");
        logoutUrl = await session.getLogoutUrl({ returnTo });
    } catch (error) {
        console.error("Failed to sign out:", error);
    }
    redirect(logoutUrl);
}
