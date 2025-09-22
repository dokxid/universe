import dbConnect from "@/lib/mongodb/connections";
import { Experience } from "@/types/api";
import ExperienceModel from "@/types/models/experiences";
import { cache } from "react";

export async function getExperiences(): Promise<Experience[]> {
    try {
        await dbConnect();
        const experiences = await ExperienceModel.find({}).exec();
        return experiences.map((exp) => exp.toJSON());
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
        return experience.toJSON();
    } catch (err) {
        throw new Error(
            "couldn't fetch experience: " +
                (err instanceof Error ? err.message : "Unknown error")
        );
    }
}

export const getExperiencesDTO = cache(async (): Promise<string> => {
    try {
        return JSON.stringify(await getExperiences());
    } catch (err) {
        console.error("Error fetching experiences:", err);
        return "<error>";
    }
});

export async function getExperienceDTO(
    experienceSlug: string
): Promise<string> {
    try {
        return JSON.stringify(await getExperience(experienceSlug));
    } catch (err) {
        console.error(`Error fetching experience ${experienceSlug}:`, err);
        return "<error>";
    }
}
