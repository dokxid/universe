import "server-only";

import { getLab, getLabsDetails, getLabs, LabWithCount, LabWithDetails } from "@/data/fetcher/lab-fetcher";
import { sanitizeToLabDetailsDTO, sanitizeToLabDTO } from "@/data/transformers/lab-transformer";
import { LabDTO } from "@/types/dtos";
import { cache } from "react";
import { isUserSuperAdmin } from "@/data/auth";

export const getLabsDTO = cache(async (): Promise<LabDTO[]> => {
    try {
        const labs = await getLabs() as LabWithCount[];
        if (!labs) {
            return [];
        }
        const sanitizedLabs: LabDTO[] = labs.map((lab) =>
            sanitizeToLabDTO(lab)
        );
        return sanitizedLabs;
    } catch (err) {
        console.error(
            "Error fetching labs: " +
            (err instanceof Error ? err.message : "Unknown error")
        );
        return [];
    }
});

export async function getLabsDetailsDTO(): Promise<LabDTO[]> {
    try {
        // check permissions
        const permissions = await isUserSuperAdmin();
        if (!permissions) {
            throw new Error("Insufficient permissions to fetch lab details");
        }
        const labs = await getLabsDetails() as LabWithDetails[];
        if (!labs) {
            return [];
        }
        const sanitizedLabs: LabDTO[] = labs.map((lab) =>
            sanitizeToLabDetailsDTO(lab)
        );
        return sanitizedLabs;
    } catch (err) {
        throw new Error(
            `Error fetching labs: ${err instanceof Error ? err.message : "Unknown error"}`
        );
    }
}

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

export async function getLabDTO(labSlug: string): Promise<LabDTO> {
    try {
        const lab = await getLab({ slug: labSlug });
        if (!lab) {
            throw new Error(`Lab not found for ID: ${labSlug}`);
        }
        const sanitizedLab = sanitizeToLabDTO(lab);
        return sanitizedLab;
    } catch (err) {
        throw new Error(
            `Error fetching lab ${labSlug}: ${err instanceof Error ? err.message : "Unknown error"}`
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
