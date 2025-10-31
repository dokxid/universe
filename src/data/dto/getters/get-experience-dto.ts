import "server-only";

import { getLab, getLabs } from "@/data/fetcher/experience-fetcher";
import { sanitizeToLabDTO } from "@/data/transformers/experience-transformer";
import { LabDTO } from "@/types/dtos";
import { cache } from "react";

export const getLabsDTO = cache(async (): Promise<LabDTO[]> => {
    try {
        const labs = await getLabs();
        if (!labs) {
            return [];
        }
        const sanitizedLabs: LabDTO[] = labs.map((lab) =>
            sanitizeToLabDTO(lab)
        );
        return sanitizedLabs;
    } catch (err) {
        console.error(
            "Error fetching experiences: " +
            (err instanceof Error ? err.message : "Unknown error")
        );
        return [];
    }
});

export const getPublicLabsDTO = cache(async (): Promise<LabDTO[]> => {
    try {
        const labs = await getLabs({ visibility: "public" });
        if (!labs) {
            return [];
        }
        const sanitizedLabs: LabDTO[] = labs.map((exp) =>
            sanitizeToLabDTO(exp)
        );
        return sanitizedLabs;
    } catch (err) {
        console.error(
            "Error fetching public labs: " +
            (err instanceof Error ? err.message : "Unknown error")
        );
        return [];
    }
});

export async function getLabDTO(experienceSlug: string): Promise<LabDTO> {
    try {
        const lab = await getLab({ slug: experienceSlug });
        if (!lab) {
            throw new Error(`Lab not found for ID: ${experienceSlug}`);
        }
        const sanitizedLab = sanitizeToLabDTO(lab);
        return sanitizedLab;
    } catch (err) {
        throw new Error(
            `Error fetching experience ${experienceSlug}: ${err instanceof Error ? err.message : "Unknown error"
            }`
        );
    }
}

export async function getLabByObjectIdDTO(labId: string): Promise<LabDTO> {
    try {
        const lab = await getLab({ id: labId });
        const sanitizedLab = sanitizeToLabDTO(lab);
        if (!lab) {
            throw new Error(`Lab not found for ID: ${labId}`);
        }
        return sanitizedLab;
    } catch (err) {
        throw new Error(
            `Error fetching lab by ID ${labId}: ${err instanceof Error ? err.message : "Unknown error"
            }`
        );
    }
}
