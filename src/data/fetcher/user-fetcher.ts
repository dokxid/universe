import "server-only";

import {
    mergeMultipleOrganizationsUsers,
    sanitizeOrganizationMembers,
} from "@/data/transformers/user-transformer";
import { workos } from "@/lib/auth/workos/callback";
import dbConnect from "@/lib/data/mongodb/connections";
import {
    InsertUserDTO,
    UserDTO,
    UserModel,
} from "@/lib/data/mongodb/models/user-model";
import { faker } from "@faker-js/faker";

export type UserUpdateDTO = {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    externalId?: string;
    profilePictureUrl?: string;
};

export async function getAllWorkOSUsers() {
    try {
        let sanitizedUsers: InsertUserDTO[] = [];
        const orgs = await getAllOrganizations();

        // Exclude the auto generated "Test Organization" to avoid test users
        const sanitizedOrgs = orgs.filter(
            (org) => org.name !== "Test Organization"
        );

        const userPromises = sanitizedOrgs.map(async (org) => {
            const users = await getUsersByOrganizationId(org.id);
            const sanitizedOrganizationMembers =
                await sanitizeOrganizationMembers(org.id, users);
            return sanitizedOrganizationMembers || [];
        });

        const allUserArrays = await Promise.all(userPromises);
        sanitizedUsers = await mergeMultipleOrganizationsUsers(
            allUserArrays.flat()
        );

        return sanitizedUsers;
    } catch (err) {
        console.error(`Error getting users: ${err}`);
        return [];
    }
}

export async function syncUsersWithDatabase() {
    try {
        await dbConnect();
        const users = await getAllWorkOSUsers();
        await UserModel.insertMany(
            users.map((user) => ({
                ...user,
                _id: faker.database.mongodbObjectId(),
            })),
            {
                ordered: true,
            }
        ).catch((err) => {
            throw new Error(`Error syncing users with database: ${err}`);
        });
    } catch (err) {
        console.error("Error syncing users with database:", err);
        throw err;
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

export async function getUserByWorkOSId(userId: string) {
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

export async function getUserRoleFromOrganizationId(
    userId: string | null,
    organizationId: string
): Promise<string> {
    try {
        if (!userId) {
            throw new Error("User ID is required to fetch user role");
        }
        const membership =
            await workos.userManagement.listOrganizationMemberships({
                userId: userId,
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
export async function getUsersFromLab(slug: string) {
    try {
        await dbConnect();
        const users = (await UserModel.find({
            "labs.slug": slug,
        }).lean()) as unknown as UserDTO[];
        return users;
    } catch (err) {
        console.error("Error fetching user from lab in database:", err);
        return null;
    }
}

export async function getUser(userId: string, fromExternalId = false) {
    try {
        let user;
        await dbConnect();
        if (fromExternalId) {
            user = (await UserModel.findOne({
                externalId: userId,
            }).lean()) as unknown as UserDTO | null;
        } else {
            user = (await UserModel.findOne({
                _id: userId,
            }).lean()) as unknown as UserDTO | null;
        }
        return user;
    } catch (err) {
        console.error("Error fetching user from database:", err);
        return null;
    }
}
