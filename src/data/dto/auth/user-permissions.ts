import { getCurrentUser, isUserAdmin, isUserSuperAdmin } from "@/data/auth";
import { UserDTO } from "@/types/dtos";

export async function canEditUser(userDTO: UserDTO): Promise<boolean> {
    const user = await getCurrentUser();
    if (!user)
        throw new Error("Not logged in");
    if (await isUserSuperAdmin()) return true;
    if (user.id === userDTO.id) return true;
    return false
}

export async function canKickUserFromLab(userToMutate: UserDTO, labSlug: string): Promise<boolean> {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser)
            throw new Error("Not logged in");
        if (currentUser.id === userToMutate.id)
            throw new Error("Users cannot kick themselves");
        if (userToMutate.labs.find(lab => lab.slug === labSlug)?.role === 'owner')
            throw new Error("Cannot kick the owner of the lab");
        if (await isUserSuperAdmin()) return true;
        if (await isUserAdmin(labSlug)) return true;
        return false;
    } catch (error) {
        console.error("Error checking kick permissions:", error);
        return false;
    }
}

export async function canInviteMembersToLab(labSlug: string): Promise<boolean> {
    if (await isUserSuperAdmin()) return true;
    if (await isUserAdmin(labSlug)) return true;
    return false;
}

export async function canInviteSuperAdmins(): Promise<boolean> {
    if (await isUserSuperAdmin()) return true;
    return false;
}

export async function canUserChangePassword(userDTO: UserDTO): Promise<boolean> {
    const currentUser = await getCurrentUser();
    if (!currentUser)
        throw new Error("Not logged in");
    if (await isUserSuperAdmin()) return true;
    if (currentUser.id === userDTO.id) return true;
    return false;
}
