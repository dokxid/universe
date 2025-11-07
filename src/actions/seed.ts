"use server";

import { startSeedingDatabase } from "@/data/scripts/seed-database-server";
import { seedOneLab } from "@/data/scripts/seed-labs";
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

export async function seedOneLabAction(
    center: number[],
    title: string,
    slug: string,
    description: string,
    subtitle: string,
    initialZoom: number,
    organizationId: string,
    labStories: number
) {
    try {
        await seedOneLab(
            center,
            title,
            slug,
            description,
            subtitle,
            initialZoom,
            organizationId,
            labStories
        );
        revalidateTag("labs");
        revalidateTag("stories");
    } catch (error) {
        console.error("Error during seeding single lab:", error);
        throw error;
    }
}
