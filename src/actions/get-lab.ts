"use server";

import { getLabDTO, getLabsDTO } from "@/data/dto/getters/get-lab-dto";
import { LabDTO } from "@/types/dtos";

export async function getLabsAction(): Promise<LabDTO[]> {
    try {
        const labs = await getLabsDTO();
        return labs;
    } catch (error) {
        console.error("Error fetching labs:", error);
        throw new Error("Failed to fetch labs");
    }
}

export async function getLabAction(
    slug: string
): Promise<LabDTO | null> {
    try {
        const lab = await getLabDTO(slug);
        return lab;
    } catch (error) {
        console.error("Error fetching lab:", error);
        throw new Error("Failed to fetch lab data");
    }
}
