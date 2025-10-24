import { isUserAdmin, isUserSuperAdmin } from "@/data/auth";

export const canUserEditLab = async (slug: string): Promise<boolean> => {
    try {
        if (await isUserSuperAdmin()) return true;
        return isUserAdmin(slug);
    } catch (error) {
        console.error("Error checking user permissions:", error);
        return false;
    }
};

export const canUserCreateLab = async (): Promise<boolean> => {
    try {
        return await isUserSuperAdmin();
    } catch (error) {
        console.error("Error checking user permissions:", error);
        return false;
    }
};
