"use server";

import { submitElevationRequestDTO } from "@/data/dto/elevation-request-dto";

export async function submitElevationRequestAction(
    storyId: string,
    slug: string,
    status: "created" | "approved" | "rejected" | "pending"
) {
    try {
        return await submitElevationRequestDTO(storyId, slug, status);
    } catch (error) {
        return JSON.stringify(error);
    }
}
