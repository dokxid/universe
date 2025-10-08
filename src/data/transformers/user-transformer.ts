import { getSlugFromOrganizationIdDTO } from "@/data/dto/experience-dto";
import { getUserRoleFromOrganizationId } from "@/data/fetcher/user-fetcher";
import { InsertUserDTO, UserDTO } from "@/lib/data/mongodb/models/user-model";
import { User } from "@workos-inc/node";

export async function sanitizeOrganizationMembers(
    organizationId: string,
    users: User[]
): Promise<InsertUserDTO[] | null> {
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
                const sanitizedUser: InsertUserDTO = {
                    externalId: user.id,
                    labs: [{ organizationId, slug, role }],
                    email: user.email,
                    firstName: user.firstName || undefined,
                    lastName: user.lastName || undefined,
                    profilePictureUrl: user.profilePictureUrl || undefined,
                    createdAt: new Date(user.createdAt),
                    updatedAt: new Date(user.updatedAt),
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
): Promise<InsertUserDTO | null> {
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
        const sanitizedUser: InsertUserDTO = {
            externalId: user.id,
            labs: [{ organizationId, slug, role }],
            email: user.email,
            firstName: user.firstName || undefined,
            lastName: user.lastName || undefined,
            profilePictureUrl: user.profilePictureUrl || undefined,
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt),
        };
        return sanitizedUser;
    } catch (err) {
        console.error(`Error sanitizing user: ${err}`);
        return null;
    }
}

export async function mergeMultipleOrganizationsUsers(
    users: InsertUserDTO[]
): Promise<InsertUserDTO[]> {
    const userMap: Map<string, InsertUserDTO> = new Map();

    users.forEach((user) => {
        if (!user.externalId) return;
        if (userMap.has(user.externalId)) {
            const existingUser = userMap.get(user.externalId);
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
            userMap.set(user.externalId, { ...user });
        }
    });

    return Array.from(userMap.values());
}

export async function sanitizeUserDTO(
    userToSanitize: UserDTO
): Promise<UserDTO> {
    return {
        ...userToSanitize,
        _id: String(userToSanitize._id),
        labs: userToSanitize.labs?.map((lab) => ({
            ...lab,
            _id: String(lab._id),
        })),
    };
}
