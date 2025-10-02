"use server";

import { getCurrentUser, isUserSuperAdmin } from "@/data/auth";
import { revalidatePath, revalidateTag } from "next/cache";

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

export async function triggerRevalidatePath(path: string) {
    try {
        const user = await getCurrentUser();
        const isSuperAdmin = await isUserSuperAdmin(user);

        if (!isSuperAdmin) {
            throw new Error("Unauthorized");
        }

        revalidatePath(path);
    } catch (error) {
        return JSON.stringify(error);
    }
}
