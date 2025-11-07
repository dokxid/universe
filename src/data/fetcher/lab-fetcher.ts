import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/data/prisma/connections";

const includeCountStories = {
    _count: {
        select: { stories: true },
    },
};

export async function getLab(whereInput: Prisma.LabWhereUniqueInput) {
    try {
        const lab = await prisma.lab.findUnique({
            where: whereInput,
            include: includeCountStories,
        });
        if (!lab)
            throw new Error(
                "Lab not found for input: " + JSON.stringify(whereInput),
            );
        return lab;
    } catch (err) {
        throw new Error(
            "couldn't fetch lab: " +
            (err instanceof Error ? err.message : "Unknown error"),
        );
    }
}

export async function getLabs(whereInput: Prisma.LabWhereInput = {}) {
    try {
        const labs = await prisma.lab.findMany({
            where: whereInput,
            include: includeCountStories,
        });
        if (!labs)
            throw new Error(
                "Labs not found for input: " + JSON.stringify(whereInput),
            );
        return labs;
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}
