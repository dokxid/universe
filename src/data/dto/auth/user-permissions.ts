import { getCurrentUser, isUserSuperAdmin } from "@/data/auth";
import { UserDTO } from "@/lib/data/mongodb/models/user-model";

export async function canEditUser(userDTO: UserDTO): Promise<boolean> {
    const user = await getCurrentUser();
    if (await isUserSuperAdmin(user)) return true;
    return user.id === userDTO.externalId;
}
