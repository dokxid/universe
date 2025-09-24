import dbConnect from "@/lib/mongodb/connections";
import { Experience } from "@/types/api";
import ExperienceModel from "@/types/models/experiences";
import { cache } from "react";

export async function getExperiences(): Promise<Experience[]> {
    try {
        await dbConnect();
        const experiences = await ExperienceModel.find({})
            .lean<Experience[]>()
            .exec();
        return experiences;
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

export async function getExperience(
    experienceSlug: string
): Promise<Experience> {
    try {
        await dbConnect();
        const experience = await ExperienceModel.findOne({
            slug: experienceSlug,
        }).exec();
        if (!experience) throw new Error("experience not found");
        return experience;
    } catch (err) {
        throw new Error(
            "couldn't fetch experience: " +
                (err instanceof Error ? err.message : "Unknown error")
        );
    }
}

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
