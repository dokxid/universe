import dbConnect from "@/lib/mongodb/connections";
import { Experience } from "@/types/api";
import ExperienceModel from "@/types/models/experiences";
import { cache } from "react";

function sanitizeExperience(experienceToSanitize: Experience) {
    return {
        ...experienceToSanitize,
        _id: experienceToSanitize._id.toString(),
        stories:
            experienceToSanitize.stories?.map((story) => ({
                ...story,
                _id: story._id?.toString(),
            })) || [],
    };
}

export async function getExperiences(): Promise<Experience[]> {
    try {
        await dbConnect();
        const experiences = await ExperienceModel.find({})
            .lean<Experience[]>()
            .exec();

        const sanitizedExperiences = experiences.map((experience) =>
            sanitizeExperience(experience)
        );

        return sanitizedExperiences;
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
        })
            .lean<Experience>()
            .exec();
        if (!experience) throw new Error("experience not found");
        const sanitizedExperience = sanitizeExperience(experience);
        return sanitizedExperience;
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
