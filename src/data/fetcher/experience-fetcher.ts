import "server-only";

import { sanitizeExperience } from "@/data/transformers/experience-transformer";
import dbConnect from "@/lib/data/mongodb/connections";
import ExperienceModel from "@/lib/data/mongodb/models/experience-model";
import { sanitizeObjectId } from "@/lib/data/mongodb/object-id-sanitizer";
import { Experience } from "@/types/dtos";

export async function getExperience(
    experienceSlug: string
): Promise<Experience> {
    try {
        await dbConnect();
        const experience = await ExperienceModel.findOne({
            slug: experienceSlug,
        }).exec();
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

export async function getExperiences(): Promise<Experience[]> {
    try {
        await dbConnect();
        const experiences = await ExperienceModel.find({}).exec();

        const sanitizedExperiences = experiences.map((experience) =>
            sanitizeExperience(experience)
        );

        return sanitizedExperiences;
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
}

export async function getLabByObjectId(id: string): Promise<Experience> {
    try {
        await dbConnect();
        const objectId = sanitizeObjectId(id);
        const lab = await ExperienceModel.findOne({
            _id: objectId,
        }).exec();
        if (!lab) throw new Error("Lab not found for ID: " + id);
        const sanitizedLab = sanitizeExperience(lab);
        return sanitizedLab;
    } catch (err) {
        throw new Error(
            `Error fetching lab by ID ${id}: ${
                err instanceof Error ? err.message : "Unknown error"
            }`
        );
    }
}
