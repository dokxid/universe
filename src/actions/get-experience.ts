"use server";

import { getLabDTO, getLabsDTO } from "@/data/dto/getters/get-experience-dto";
import { LabDTO } from "@/types/dtos";

export async function getExperiencesAction(): Promise<LabDTO[]> {
    try {
        const experiences = await getLabsDTO();
        return experiences;
    } catch (error) {
        console.error("Error fetching labs:", error);
        throw new Error("Failed to fetch labs");
    }
}

export async function getExperienceAction(
    slug: string
): Promise<LabDTO | null> {
    try {
        const experience = await getLabDTO(slug);
        return experience;
    } catch (error) {
        console.error("Error fetching lab:", error);
        throw new Error("Failed to fetch lab data");
    }
}
