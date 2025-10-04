"use server";

import { signOut } from "@workos-inc/authkit-nextjs";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function signOutAction(slug?: string) {
    let returnTo = "/";
    if (slug) {
        returnTo = `/${slug}/map`;
    }
    try {
        (await cookies()).delete("wos-session");
        if (!process.env.VERCEL_URL) {
            console.log(
                "Development environment detected, using localhost for returnTo URL"
            );
            revalidateTag("user");
            returnTo = "http://localhost:3000" + returnTo;
            await signOut({ returnTo });
            redirect(returnTo);
        }
        revalidateTag("user");
        await signOut({ returnTo });
        redirect(returnTo);
    } catch (error) {
        console.error("Failed to sign out:", error);
    }
}

export { signOutAction };
