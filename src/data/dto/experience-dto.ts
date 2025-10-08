import "server-only";

import {
    getExperience,
    getExperiences,
    getLabByObjectId,
} from "@/data/fetcher/experience-fetcher";
import experienceModel from "@/lib/data/mongodb/models/experience-model";
import { ExperienceDTO } from "@/types/dtos";
import { cache } from "react";

export const getExperiencesDTO = cache(async (): Promise<ExperienceDTO[]> => {
    try {
        const labs = await getExperiences();
        const sanitizedLabs: ExperienceDTO[] = labs.map((lab) => ({
            ...lab,
            amountStories: lab.stories.length,
        }));
        return sanitizedLabs;
    } catch (err) {
        throw new Error(
            "Error fetching experiences: " +
                (err instanceof Error ? err.message : "Unknown error")
        );
    }
});

export const getPublicLabsDTO = cache(async (): Promise<ExperienceDTO[]> => {
    try {
        const experiences = await getExperiences();
        const sanitizedExperiences: ExperienceDTO[] = experiences.map(
            (exp) => ({ ...exp, amountStories: exp.stories.length })
        );
        return sanitizedExperiences.filter(
            (exp) => exp.visibility === "public"
        );
    } catch (err) {
        throw new Error(
            "Error fetching public labs: " +
                (err instanceof Error ? err.message : "Unknown error")
        );
    }
});

export async function getExperienceDTO(
    experienceSlug: string
): Promise<ExperienceDTO> {
    try {
        const lab = await getExperience(experienceSlug);
        const sanitizedLab: ExperienceDTO = {
            ...lab,
            amountStories: lab.stories.length,
        };
        return sanitizedLab;
    } catch (err) {
        throw new Error(
            `Error fetching experience ${experienceSlug}: ${
                err instanceof Error ? err.message : "Unknown error"
            }`
        );
    }
}

export async function getLabByObjectIdDTO(
    labId: string
): Promise<ExperienceDTO> {
    try {
        const lab = await getLabByObjectId(labId);
        const sanitizedLab: ExperienceDTO = {
            ...lab,
            amountStories: lab.stories.length,
        };
        if (!lab) {
            throw new Error(`Lab not found for ID: ${labId}`);
        }
        return sanitizedLab;
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
            organization_id: experience.organizationId,
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
            organizationId: organizationId,
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
