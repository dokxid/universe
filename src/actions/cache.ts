"use server";

import { isUserSuperAdmin } from "@/data/auth";
import { revalidatePath, revalidateTag } from "next/cache";

export async function triggerRevalidateTagAction(tag: string) {
    try {
        const isSuperAdmin = await isUserSuperAdmin();

        if (!isSuperAdmin) {
            throw new Error("Unauthorized");
        }

        revalidateTag(tag);
    } catch (error) {
        return JSON.stringify(error);
    }
}

export async function triggerRevalidatePathAction(path: string) {
    try {
        const isSuperAdmin = await isUserSuperAdmin();

        if (!isSuperAdmin) {
            throw new Error("Unauthorized");
        }

        revalidatePath(path, "page");
    } catch (error) {
        return JSON.stringify(error);
    }
}
