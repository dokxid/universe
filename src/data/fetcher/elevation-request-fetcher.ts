import "server-only";

import { Prisma, PrismaClient } from "@/generated/prisma/client";
import dbConnect from "@/lib/data/mongodb/connections";

const prisma = new PrismaClient();

export async function insertElevationRequest(
    requestToInsert: Prisma.ElevationRequestCreateInput,
    storyId: string
) {
    try {
        dbConnect();
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
