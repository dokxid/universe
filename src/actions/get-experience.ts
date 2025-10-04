"use server";

import { getExperienceDTO, getExperiencesDTO } from "@/data/dto/experience-dto";
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

export async function getExperienceAction(
    slug: string
): Promise<Experience | null> {
    try {
        const experience = await getExperienceDTO(slug);
        return experience;
    } catch (error) {
        console.error("Error fetching lab:", error);
        throw new Error("Failed to fetch lab data");
    }
}
