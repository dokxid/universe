import { getCurrentUser, isUserSuperAdmin } from "@/data/auth";
import { UserDTO } from "@/types/dtos";

export async function canEditUser(userDTO: UserDTO): Promise<boolean> {
    const user = await getCurrentUser();
    if (!user) return false;
    if (await isUserSuperAdmin()) return true;
    return user.id === userDTO.id;
}
