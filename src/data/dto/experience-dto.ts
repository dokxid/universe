import {
    getExperience,
    getExperiences,
} from "@/data/fetcher/experience-fetcher";
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
