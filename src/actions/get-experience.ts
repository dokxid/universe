"use server";

import { getExperiencesDTO } from "@/data/dto/experience-dto";
import { Experience } from "@/types/dtos";

export async function getExperiencesAction(): Promise<Experience[]> {
    try {
        const experiences = await getExperiencesDTO();
        return experiences;
    } catch (error) {
        console.error("Error fetching labs:", error);
        throw new Error("Failed to fetch labs");
    }
}
