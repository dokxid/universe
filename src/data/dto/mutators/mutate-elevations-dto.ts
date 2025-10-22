import "server-only";

import { isUserAdmin } from "@/data/auth";
import { insertElevationRequest } from "@/data/fetcher/elevation-request-fetcher";
import dbConnect from "@/lib/data/mongodb/connections";
import { NewElevationRequestData } from "@/types/dtos";
import mongoose from "mongoose";
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
        await dbConnect();

        // validate id before creating ObjectId
        if (!mongoose.Types.ObjectId.isValid(storyID)) {
            throw new Error("Invalid story id format.");
        }

        // parse serializable id to mongoose.Types.ObjectId
        const objectId = new mongoose.Types.ObjectId(storyID);
        await insertElevationRequest(slug, requestToInsert, objectId);
        revalidatePath(`/universe/elevation_requests`);
        revalidatePath(`/${slug}/stories/manage`);
    } catch (err) {
        console.error("Error submitting elevation request:", err);
    }
}
