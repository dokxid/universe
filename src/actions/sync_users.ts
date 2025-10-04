"use server";

import { syncUsersWithDatabase } from "@/data/fetcher/user-fetcher";

export async function syncUsersWithDatabaseAction() {
    try {
        await syncUsersWithDatabase();
    } catch (err) {
        console.error("Error syncing users with database:", err);
    }
}
