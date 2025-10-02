import { workos } from "@/lib/auth/workos/callback";

export async function getUserDTO(userId: string) {
    try {
        return JSON.stringify(await workos.userManagement.getUser(userId));
    } catch (err) {
        console.error("Error fetching user:", err);
        return "<error>";
    }
}

export async function getUsersBySlug(slug: string) {
    try {
        const usersToReturn = await workos.userManagement.listUsers({
            organizationId: slug,
        });
        return JSON.stringify(usersToReturn.data);
    } catch (err) {
        console.error("Error fetching users by slug:", err);
        return "<error>";
    }
}

export async function getUsersDTO() {
    try {
        const usersToReturn = await workos.userManagement.listUsers();
        return JSON.stringify(usersToReturn.data);
    } catch (err) {
        console.error("Error fetching users:", err);
        return "<error>";
    }
}
