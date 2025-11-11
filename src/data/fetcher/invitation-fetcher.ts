import "server-only";

import { prisma } from "@/lib/data/prisma/connections";

export const fetchInvitation = async (invitationId: string) => {
    return prisma.invitation.findUnique({
        where: { id: invitationId },
        include: {
            user: {
                select: {
                    id: true,
                    displayName: true,
                    firstName: true,
                    familyName: true,
                },
            },
            lab: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    logo: true,
                },
            },
        },
    });
};
