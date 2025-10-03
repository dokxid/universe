"use server";

import { submitElevationRequestDTO } from "@/data/dto/elevation-request-dto";
import { User } from "@workos-inc/node";

export async function submitElevationRequestAction(
    storyId: string,
    user: User | null,
    slug: string,
    status: "created" | "approved" | "rejected" | "pending"
) {
    try {
        // case user is null, return error
        if (!user) throw new Error("You must be logged in to submit a story.");
        return await submitElevationRequestDTO(storyId, user, slug, status);
    } catch (error) {
        return JSON.stringify(error);
    }
}
