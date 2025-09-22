"use server";

import { signOut } from "@workos-inc/authkit-nextjs";

async function signOutAction(slug?: string) {
    let returnTo = "/";
    if (slug) {
        returnTo = `/${slug}/login`;
    }
    try {
        return signOut({ returnTo: returnTo });
    } catch (error) {
        console.error("Failed to sign out:", error);
    }
}

export { signOutAction };
