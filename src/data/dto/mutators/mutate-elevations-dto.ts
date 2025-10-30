import "server-only";

import { isUserAdmin } from "@/data/auth";
import { insertElevationRequest } from "@/data/fetcher/elevation-request-fetcher";
import { NewElevationRequestData } from "@/types/dtos";
import { revalidatePath } from "next/cache";

export async function createElevationRequestDTO(
    storyID: string,
    slug: string,
    status: "created" | "approved" | "rejected" | "pending"
) {
    try {
        if (!isUserAdmin(slug)) {
            throw new Error("You must be an admin to request elevation.");
        }
        const requestToInsert: NewElevationRequestData = {
            status: status,
            requestedAt: new Date(),
            resolvedAt: new Date(),
        };

        await insertElevationRequest(requestToInsert, storyID);
        revalidatePath(`/universe/elevation_requests`);
        revalidatePath(`/${slug}/stories/manage`);
    } catch (err) {
        console.error("Error submitting elevation request:", err);
    }
}
