import { getUserRolesFromOrganizationId } from "@/data/fetcher/user-fetcher";
import { UserDTO } from "@/lib/data/mongodb/models/user-model";
import { User } from "@workos-inc/node";

export async function sanitizeOrganizationMembers(
    organizationId: string,
    users: User[]
): Promise<UserDTO[] | null> {
    try {
        const sanitizedUsers = await Promise.all(
            users.map(async (user) => {
                const roles = await getUserRolesFromOrganizationId(
                    user,
                    organizationId
                );
                const sanitizedUser: UserDTO = {
                    id: user.id,
                    organizationId,
                    email: user.email,
                    roles: roles,
                    firstName: user.firstName || undefined,
                    lastName: user.lastName || undefined,
                    profilePictureUrl: user.profilePictureUrl || undefined,
                };
                return sanitizedUser;
            })
        );
        return sanitizedUsers;
    } catch (err) {
        console.error("Error sanitizing user:", err);
        return null;
    }
}
