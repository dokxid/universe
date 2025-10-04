import "server-only";

import { getUsersFromOrganizationInDatabase } from "@/data/fetcher/user-fetcher";

export async function getUsersByLabDTO(labSlug: string) {
    try {
        return await getUsersFromOrganizationInDatabase(labSlug);
    } catch (err) {
        console.error("Error fetching users by lab:", err);
        return "<error>";
    }
}
