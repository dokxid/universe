"use server";

import { getSlugFromOrganizationIdDTO } from "@/data/dto/getters/get-experience-dto";
import type { AuthException } from "@/types/workos-errors";
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
        const slug = await getSlugFromOrganizationIdDTO(organizationId);
        return { redirectUrl: slug ? `/${slug}/map` : "/universe/map" };
    } catch (error) {
        // this looks so ugly jesus christ
        if (
            error instanceof Error &&
            "rawData" in error &&
            "code" in (error as AuthException).rawData
        ) {
            const authError = error as AuthException;
            if (authError.rawData.code === "organization_selection_required") {
                return {
                    organizationId: "Please select an organization.",
                    pendingAuthToken:
                        authError.rawData.pending_authentication_token,
                    organizations: authError.rawData.organizations,
                };
            } else {
                return {
                    email: "Invalid email or password.",
                    password: "Please check your password",
                };
            }
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
