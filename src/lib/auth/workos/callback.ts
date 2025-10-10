import "server-only";

import { WorkOS } from "@workos-inc/node";

export const workos = new WorkOS(process.env.WORKOS_API_KEY || "");

export function getRedirectUri() {
    if (process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI) {
        return process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI;
    }
    if (process.env.NODE_ENV === "development") {
        return "http://localhost:3000/auth/callback";
    }
    return `https://${process.env.VERCEL_URL}/auth/callback`;
}
