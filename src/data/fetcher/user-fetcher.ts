import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/data/prisma/connections";
import { UserGetPayload } from "@/generated/prisma/models";


const includeOptions = {
    include: {
        stories: {
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
        },
        members: {
            select: {
                role: true,
                labId: true,
                lab: {
                    select: {
                        slug: true,
                        name: true,
                    },
                },
            },
        },
        _count: {
            select: { stories: { where: { draft: false } } }
        }
    }
}

export type UserFetched = UserGetPayload<typeof includeOptions>;

export async function getUser(whereInput: Prisma.UserWhereUniqueInput): Promise<UserFetched | null> {
    try {
        const result = await prisma.user.findUnique({
            where: whereInput,
            ...includeOptions,
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
            ...includeOptions,
        });
        return result;
    } catch (err) {
        console.error("Error fetching users from database:", err);
        return [];
    }
}
