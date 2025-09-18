import { withAuth } from "@workos-inc/authkit-nextjs";
import { cache } from "react";

export const getCurrentUser = cache(async () => {
    const { user } = await withAuth({ ensureSignedIn: true });
    return user;
});

export function isEditor(role: string) {
    return role == "member" || "admin";
}

export function isAdmin(role: string) {
    return role == "admin";
}
