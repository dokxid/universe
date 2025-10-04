import { getSlugFromOrganizationIdDTO } from "@/data/dto/experience-dto";
import { getUserRoleFromOrganizationId } from "@/data/fetcher/user-fetcher";
import { UserDTO } from "@/lib/data/mongodb/models/user-model";
import { User } from "@workos-inc/node";

export async function sanitizeOrganizationMembers(
    organizationId: string,
    users: User[]
): Promise<UserDTO[] | null> {
    try {
        const slug = await getSlugFromOrganizationIdDTO(organizationId);
        if (!slug) {
            throw new Error(
                `Could not find slug for organization ID: ${organizationId}`
            );
        }
        const sanitizedUsers = await Promise.all(
            users.map(async (user) => {
                const role = await getUserRoleFromOrganizationId(
                    user.id,
                    organizationId
                );
                const sanitizedUser: UserDTO = {
                    id: user.id,
                    labs: [{ organizationId, slug, role }],
                    email: user.email,
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

export async function sanitizeSingleUser(
    organizationId: string,
    user: User
): Promise<UserDTO | null> {
    try {
        const role = await getUserRoleFromOrganizationId(
            user.id,
            organizationId
        );
        const slug = await getSlugFromOrganizationIdDTO(organizationId);
        if (!slug) {
            throw new Error(
                `Could not find slug for organization ID: ${organizationId}`
            );
        }
        const sanitizedUser: UserDTO = {
            id: user.id,
            labs: [{ organizationId, slug, role }],
            email: user.email,
            firstName: user.firstName || undefined,
            lastName: user.lastName || undefined,
            profilePictureUrl: user.profilePictureUrl || undefined,
        };
        return sanitizedUser;
    } catch (err) {
        console.error(`Error sanitizing user: ${err}`);
        return null;
    }
}

export async function mergeMultipleOrganizationsUsers(
    users: UserDTO[]
): Promise<UserDTO[]> {
    const userMap: Map<string, UserDTO> = new Map();

    users.forEach((user) => {
        if (userMap.has(user.id)) {
            const existingUser = userMap.get(user.id);
            if (existingUser) {
                if (!existingUser.labs) {
                    existingUser.labs = [];
                }
                if (!user.labs) {
                    user.labs = [];
                }
                // Merge organizationIds and roles
                existingUser.labs = [...existingUser.labs, ...user.labs];
            }
        } else {
            userMap.set(user.id, { ...user });
        }
    });

    return Array.from(userMap.values());
}
