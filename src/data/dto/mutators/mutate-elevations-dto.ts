import "server-only";

import { isUserAdmin } from "@/data/auth";
import { insertElevationRequest } from "@/data/fetcher/elevation-request-fetcher";
import { revalidatePath } from "next/cache";
import { ElevationRequestCreateInput } from "@/generated/prisma/models";
import { prisma } from "@/lib/data/prisma/connections";

export async function createElevationRequestDTO(
    storyId: string,
    slug: string,
    toBeStatus: "created" | "approved" | "rejected" | "pending"
) {
    try {
        if (!isUserAdmin(slug)) {
            throw new Error("You must be an admin to request elevation.");
        }

        const story = await prisma.story.findUnique({
            where: { id: storyId },
            select: {
                elevationRequests: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    select: { status: true }
                },
            }
        });

        // check elevation request status
        if (!story) throw new Error("Story not found.")
        const latestStatus = story.elevationRequests[0].status;
        if (toBeStatus === "pending" && latestStatus === "approved") {
            throw new Error("Cannot request elevation when already approved.")
        }
        if (toBeStatus === "approved" && latestStatus !== "pending") {
            throw new Error("Cannot approve elevation request that is not requested.")
        }

        const requestToInsert: ElevationRequestCreateInput = {
            status: toBeStatus,
        };

        await insertElevationRequest(requestToInsert, storyId);
        revalidatePath(`/universe/elevation_requests`);
        revalidatePath(`/${slug}/stories/manage`);
    } catch (err) {
        console.error("Error submitting elevation request:", err);
    }
}
