import "server-only";

import { sanitizeOrganizationMembers } from "@/data/transformers/user-transformer";
import { workos } from "@/lib/auth/workos/callback";
import dbConnect from "@/lib/data/mongodb/connections";
import UserModel, { UserDTO } from "@/lib/data/mongodb/models/user-model";
import { User } from "@workos-inc/node";

export type UserUpdateDTO = {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    externalId?: string;
    profilePictureUrl?: string;
};

export async function getAllUsers() {
    try {
        let sanitizedUsers: UserDTO[] = [];
        const orgs = await getAllOrganizations();

        const userPromises = orgs.map(async (org) => {
            const users = await getUsersByOrganizationId(org.id);
            const sanitizedOrganizationMembers =
                await sanitizeOrganizationMembers(org.id, users);
            return sanitizedOrganizationMembers || [];
        });

        const allUserArrays = await Promise.all(userPromises);
        sanitizedUsers = allUserArrays.flat();

        return sanitizedUsers;
    } catch (err) {
        console.error("Error getting users:", err);
        return [];
    }
}

export async function syncUsersWithDatabase() {
    try {
        const users = await getAllUsers();
        dbConnect();
        UserModel.insertMany(users, { ordered: true }).catch((err) => {
            throw new Error("Error syncing users with database:", err);
        });
    } catch (err) {
        console.error("Error syncing users with database:", err);
    }
}

export async function getAllOrganizations() {
    try {
        const orgsToReturn = await workos.organizations.listOrganizations();
        return orgsToReturn.data;
    } catch (err) {
        console.error("Error fetching all organizations:", err);
        return [];
    }
}

export async function getUserById(userId: string) {
    try {
        return await workos.userManagement.getUser(userId);
    } catch (err) {
        console.error("Error fetching user by ID:", err);
        return null;
    }
}

export async function getUsersByOrganizationId(organizationId: string) {
    try {
        const usersToReturn = await workos.userManagement.listUsers({
            organizationId,
        });
        return usersToReturn.data;
    } catch (err) {
        console.error("Error fetching users by organization ID:", err);
        return [];
    }
}

export async function updateUser(
    userId: string,
    dataToBeUpdated: UserUpdateDTO
) {
    try {
        return await workos.userManagement.updateUser({
            userId: userId,
            ...dataToBeUpdated,
        });
    } catch (err) {
        console.error("Error updating user:", err);
        return null;
    }
}

export async function deleteUser(userId: string) {
    try {
        await workos.userManagement.deleteUser(userId);
        return true;
    } catch (err) {
        console.error("Error deleting user:", err);
        return false;
    }
}

export async function getUserRolesFromOrganizationId(
    user: User | null,
    organizationId: string
): Promise<string> {
    try {
        if (!user) throw new Error("User is not authenticated");
        const membership =
            await workos.userManagement.listOrganizationMemberships({
                userId: user.id,
                organizationId,
            });
        const membershipToReturn = membership.data.pop();
        if (membershipToReturn === undefined) {
            throw new Error("No membership found");
        }
        return membershipToReturn.role.slug;
    } catch (err) {
        console.error("Error fetching user roles:", err);
        throw err;
    }
}
