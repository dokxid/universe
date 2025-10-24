import "server-only";

import { Prisma, PrismaClient } from "@/generated/prisma/client";
import { workos } from "@/lib/auth/workos/callback";

const prisma = new PrismaClient();

const storiesSelectFields: { select: Prisma.StorySelect } = {
    select: {
        id: true,
        title: true,
        lab: {
            select: {
                id: true,
                slug: true,
            },
        },
    },
};

const membersSelectFields: { select: Prisma.MemberSelect } = {
    select: {
        role: true,
        labId: true,
        lab: {
            select: {
                slug: true,
            },
        },
    },
};

// export async function getAllWorkOSUsers() {
//     try {
//         let sanitizedUsers: InsertUserDTO[] = [];
//         const orgs = await getAllOrganizations();

//         // Exclude the auto generated "Test Organization" to avoid test users
//         const sanitizedOrgs = orgs.filter(
//             (org) => org.name !== "Test Organization"
//         );

//         const userPromises = sanitizedOrgs.map(async (org) => {
//             const users = await getUsersByOrganizationId(org.id);
//             const sanitizedOrganizationMembers =
//                 await sanitizeOrganizationMembers(org.id, users);
//             return sanitizedOrganizationMembers || [];
//         });

//         const allUserArrays = await Promise.all(userPromises);
//         sanitizedUsers = await mergeMultipleOrganizationsUsers(
//             allUserArrays.flat()
//         );

//         return sanitizedUsers;
//     } catch (err) {
//         console.error(`Error getting users: ${err}`);
//         return [];
//     }
// }

// export async function syncUsersWithDatabase() {
//     try {
//         await dbConnect();
//         const users = await getAllWorkOSUsers();

//         const result = await UserModel.insertMany(
//             users.map((user) => ({
//                 ...user,
//             })),
//             {
//                 ordered: false,
//             }
//         ).catch((err) => {
//             if (err.code === 11000) {
//                 console.warn(
//                     `Skipped ${
//                         err.result?.nInserted || 0
//                     } duplicate users during sync`
//                 );
//                 return err.result; // Return the partial result
//             }
//             throw new Error(`Error syncing users with database: ${err}`);
//         });

//         console.log(
//             `Successfully synced users: ${
//                 result?.insertedCount || 0
//             } new users added`
//         );
//     } catch (err) {
//         console.error("Error syncing users with database:", err);
//         throw err;
//     }
// }

export async function getAllOrganizations() {
    try {
        const orgsToReturn = await workos.organizations.listOrganizations();
        return orgsToReturn.data;
    } catch (err) {
        console.error("Error fetching all organizations:", err);
        return [];
    }
}

// export async function getWorkOSUserByWorkOSId(
//     userId: string
// ): Promise<User | null> {
//     try {
//         return await workos.userManagement.getUser(userId);
//     } catch (err) {
//         console.error("Error fetching user by ID:", err);
//         return null;
//     }
// }

// export async function getUserByWorkOSId(userId: string) {
//     try {
//         const user = (await UserModel.findOne({
//             externalId: userId,
//         }).lean()) as unknown as UserDTO | null;
//         if (!user) {
//             throw new Error("User not found");
//         }
//         return user;
//     } catch (err) {
//         console.error("Error fetching user by ID:", err);
//         return null;
//     }
// }

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

export async function getUser(whereInput: Prisma.UserWhereUniqueInput) {
    try {
        const result = await prisma.user.findUnique({
            where: whereInput,
            include: {
                stories: storiesSelectFields,
                members: membersSelectFields,
            },
        });
        return result;
    } catch (err) {
        console.error("Error fetching user from database:", err);
        return null;
    }
}

export async function getUsers(whereInput: Prisma.UserWhereInput) {
    try {
        const result = await prisma.user.findMany({
            where: whereInput,
            include: {
                stories: storiesSelectFields,
                members: membersSelectFields,
            },
        });
        return result;
    } catch (err) {
        console.error("Error fetching users from database:", err);
        return [];
    }
}
