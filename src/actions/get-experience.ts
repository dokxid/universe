"use server";

import { getExperienceDTO, getExperiencesDTO } from "@/data/dto/experience-dto";
import { ExperienceDTO } from "@/types/dtos";

export async function getExperiencesAction(): Promise<ExperienceDTO[]> {
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
): Promise<ExperienceDTO | null> {
    try {
        const experience = await getExperienceDTO(slug);
        return experience;
    } catch (error) {
        console.error("Error fetching lab:", error);
        throw new Error("Failed to fetch lab data");
    }
}
