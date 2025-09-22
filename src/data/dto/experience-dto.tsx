import dbConnect from "@/lib/mongodb/connections";
import { ExperienceData } from "@/types/api";
import Experience from "@/types/models/experiences";
import { cache } from "react";

export async function getExperiences() {
    try {
        await dbConnect();
        const experiences = await Experience.find({}).exec();
        return experiences.map((exp) => exp.toJSON());
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

export async function getExperience(
    experienceSlug: string
): Promise<ExperienceData> {
    try {
        await dbConnect();
        const experience = await Experience.findOne({
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

export async function getExperienceDTO(experienceSlug: string) {
    try {
        return JSON.stringify(await getExperience(experienceSlug));
    } catch (err) {
        console.error(`Error fetching experience ${experienceSlug}:`, err);
        return "<error>";
    }
}
