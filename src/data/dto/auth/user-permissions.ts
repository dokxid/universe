import { getCurrentUser, isUserSuperAdmin } from "@/data/auth";
import { UserDTO } from "@/types/dtos";

export async function canEditUser(userDTO: UserDTO): Promise<boolean> {
    const user = await getCurrentUser();
    if (await isUserSuperAdmin(user)) return true;
    return user.id === userDTO.id;
}
