import "server-only";

import { Prisma, PrismaClient } from "@/generated/prisma/client";

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
                _count: { select: { stories: true } },
            },
        });
        return result;
    } catch (err) {
        console.error("Error fetching users from database:", err);
        return [];
    }
}
