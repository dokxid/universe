import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/data/prisma/connections";


export async function insertElevationRequest(
    requestToInsert: Prisma.ElevationRequestCreateInput,
    storyId: string
) {
    try {
        const createElevationRequestResult = await prisma.story.update({
            where: { id: storyId },
            data: {
                elevationRequests: {
                    create: requestToInsert,
                },
            },
        });
        return createElevationRequestResult;
    } catch (err) {
        console.error("Error inserting elevation request:", err);
        throw err; // Re-throw to propagate the error
    }
}
