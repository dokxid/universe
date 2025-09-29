"use server";

import { signOut } from "@workos-inc/authkit-nextjs";
import { revalidateTag } from "next/cache";

async function signOutAction(slug?: string) {
    let returnTo = "/";
    if (slug) {
        returnTo = `/${slug}`;
    }
    try {
        if (!process.env.VERCEL_URL) {
            console.log(
                "Development environment detected, using localhost for returnTo URL"
            );
            return signOut({ returnTo: "http://localhost:3000/" });
        }
        revalidateTag("user");
        return signOut({ returnTo });
    } catch (error) {
        console.error("Failed to sign out:", error);
    }
}

export { signOutAction };
