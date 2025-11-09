import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/data/prisma/connections";
import { LabInclude } from "@/generated/prisma/models";
import { isUserSuperAdmin } from "../auth";

export type LabWithCount = Prisma.LabGetPayload<{ include: typeof includeCountStories }>;
export type LabWithDetails = Prisma.LabGetPayload<{ include: typeof includeDetails }>;

const includeCountStories: LabInclude = {
    _count: {
        select: {
            stories: true,
            members: true,
        },
    },
};

const includeDetails: LabInclude = {
    _count: {
        select: {
            stories: true,
            members: true,
        },
    },
    stories: {
        where: { visibleUniverse: true, draft: false },
    },
};

/**
 * Fetches a lab by unique input with count of stories and members.
 * @param whereInput - unique identifier for the lab (e.g., { id: "..." } or { slug: "..." })
 * @returns the lab matching the whereInput with count of stories and members
 * @throws error if lab not found or query fails
 */
export async function getLab(
    whereInput: Prisma.LabWhereUniqueInput,
): Promise<LabWithCount> {
    try {
        const lab = await prisma.lab.findUnique({
            where: whereInput,
            include: includeCountStories,
        });
        if (!lab) {
            throw new Error(
                `Lab not found for input: ${JSON.stringify(whereInput)}`,
            );
        }
        return lab;
    } catch (err) {
        throw new Error(
            `Failed to fetch lab: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
    }
}

/**
 * Fetches all labs with detailed information including member roles.
 * Requires super admin permissions.
 * @returns array of labs with member roles and counts of stories/members
 * @throws error if query fails
 */
export async function getLabsDetails(whereInput: Prisma.LabWhereInput = {}): Promise<LabWithDetails[]> {
    try {
        // check permissions
        const permissions = await isUserSuperAdmin();
        if (!permissions) {
            throw new Error("Insufficient permissions to fetch lab details");
        }
        const labs = await prisma.lab.findMany({
            where: whereInput,
            include: includeDetails,
        });
        const labsWithDetails = labs.map((lab) => {
            return {
                ...lab,
            } satisfies LabWithDetails;
        }) as LabWithDetails[];
        return labsWithDetails;
    } catch (err) {
        throw new Error(
            `Failed to fetch lab details: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
    }
}

/**
 * Fetches multiple labs with count of stories and members.
 * @param whereInput - optional filter criteria for labs (defaults to all labs)
 * @returns array of labs matching the filter with counts of stories and members
 * @throws error if query fails
 */
export async function getLabs(
    whereInput: Prisma.LabWhereInput = {},
): Promise<LabWithCount[]> {
    try {
        const labs = await prisma.lab.findMany({
            where: whereInput,
            include: includeCountStories,
        });
        return labs;
    } catch (err) {
        throw new Error(
            `Failed to fetch labs: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
    }
}
