"use server";

import { getCurrentUser, isUserSuperAdmin } from "@/data/auth";
import { revalidateTag } from "next/cache";

export async function triggerRevalidateTag(tag: string) {
    try {
        const user = await getCurrentUser();
        const isSuperAdmin = await isUserSuperAdmin(user);

        if (!isSuperAdmin) {
            throw new Error("Unauthorized");
        }

        revalidateTag(tag);
    } catch (error) {
        return JSON.stringify(error);
    }
}
