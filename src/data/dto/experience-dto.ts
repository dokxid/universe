import "server-only";

import {
    getExperience,
    getExperiences,
    getLabByObjectId,
} from "@/data/fetcher/experience-fetcher";
import experienceModel from "@/lib/data/mongodb/models/experience-model";
import { Experience } from "@/types/dtos";
import { cache } from "react";

export const getExperiencesDTO = cache(async (): Promise<Experience[]> => {
    try {
        return await getExperiences();
    } catch (err) {
        throw new Error(
            "Error fetching experiences: " +
                (err instanceof Error ? err.message : "Unknown error")
        );
    }
});

export async function getExperienceDTO(
    experienceSlug: string
): Promise<Experience> {
    try {
        return await getExperience(experienceSlug);
    } catch (err) {
        throw new Error(
            `Error fetching experience ${experienceSlug}: ${
                err instanceof Error ? err.message : "Unknown error"
            }`
        );
    }
}

export async function getLabByObjectIdDTO(labId: string): Promise<Experience> {
    try {
        const lab = await getLabByObjectId(labId);
        if (!lab) {
            throw new Error(`Lab not found for ID: ${labId}`);
        }
        return lab;
    } catch (err) {
        throw new Error(
            `Error fetching lab by ID ${labId}: ${
                err instanceof Error ? err.message : "Unknown error"
            }`
        );
    }
}

export async function getExperienceSignInDTO(experienceSlug: string) {
    try {
        const experience = await getExperience(experienceSlug);
        return {
            organization_id: experience.organization_id,
            connection_id: experience.connection_id,
        };
    } catch (err) {
        throw new Error(
            `Error fetching experience ${experienceSlug}: ${
                err instanceof Error ? err.message : "Unknown error"
            }`
        );
    }
}

export async function getSlugFromOrganizationIdDTO(
    organizationId: string
): Promise<string | null> {
    try {
        const experience = await experienceModel.findOne({
            organization_id: organizationId,
        });
        if (!experience) {
            throw new Error(
                `No experiences found for organization ID: ${organizationId}`
            );
        }
        if (!experience?.slug) {
            throw new Error(
                `Could not find experience for organization ID: ${organizationId}`
            );
        }
        console.log("experience slug: ", experience.slug);
        return experience.slug;
    } catch (err) {
        console.error("Error fetching slug from organization ID:", err);
        return null;
    }
}
