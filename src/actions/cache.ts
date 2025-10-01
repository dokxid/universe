"use server";

import { getCurrentUser, isUserSuperAdmin } from "@/data/auth";
import { revalidateTag } from "next/cache";

export async function triggerRevalidateTag(tag: string) {
    const user = await getCurrentUser();
    const isSuperAdmin = await isUserSuperAdmin(user);

    if (!isSuperAdmin) {
        throw new Error("Unauthorized");
    }

    console.log(`Revalidating tag: ${tag}`);
    revalidateTag(tag);
}
