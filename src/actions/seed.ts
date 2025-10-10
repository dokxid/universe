"use server";

import { startSeedingDatabase } from "@/data/scripts/seed-database-server";
import { seedOneExperience } from "@/data/scripts/seed-experiences";
import { revalidateTag } from "next/cache";

export async function seedDatabaseAction(
    numRandomCityCenters: number,
    numStories: number
) {
    try {
        await startSeedingDatabase(numRandomCityCenters, numStories);
    } catch (error) {
        console.error("Error during database seeding:", error);
        throw error;
    }
}

export async function seedOneExperienceAction(
    center: number[],
    title: string,
    slug: string,
    description: string,
    subtitle: string,
    initialZoom: number,
    organizationId: string,
    experienceStories: number
) {
    try {
        await seedOneExperience(
            center,
            title,
            slug,
            description,
            subtitle,
            initialZoom,
            organizationId,
            experienceStories
        );
        revalidateTag("experiences");
        revalidateTag("stories");
    } catch (error) {
        console.error("Error during seeding single experience:", error);
        throw error;
    }
}
