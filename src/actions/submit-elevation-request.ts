"use server";

import { createElevationRequestDTO } from "@/data/dto/mutators/mutate-elevations-dto";

export async function submitElevationRequestAction(
    storyId: string,
    slug: string,
    status: "created" | "approved" | "rejected" | "pending"
) {
    try {
        return await createElevationRequestDTO(storyId, slug, status);
    } catch (error) {
        return JSON.stringify(error);
    }
}
