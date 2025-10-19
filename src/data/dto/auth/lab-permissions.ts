import { getCurrentUser, isUserAdmin, isUserSuperAdmin } from "@/data/auth";

export const canUserEditLab = async (slug: string): Promise<boolean> => {
    try {
        const user = await getCurrentUser();
        if (!user) return false;
        if (await isUserSuperAdmin(user)) return true;
        return isUserAdmin(slug);
    } catch (error) {
        console.error("Error checking user permissions:", error);
        return false;
    }
};
