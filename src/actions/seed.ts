"use server";

import { initDatabase } from "@/data/scripts/seed-database";
import { startSeedingDatabase } from "@/data/scripts/seed-database-server";
import { seedOneLab } from "@/data/scripts/seed-labs";
import { revalidateTag } from "next/cache";

export async function seedDatabaseAction(
    numRandomCityCenters: number,
    numStories: number
) {
    try {
        const result = await startSeedingDatabase(numRandomCityCenters, numStories);
        if (!result) {
            return { success: false, error: "Seeding failed" };
        }
        revalidateTag("labs");
        revalidateTag("stories");
        revalidateTag("tags");
        return result;
    } catch (error) {
        console.error("Error during database seeding:", error);
        return { success: false, error };
    }
}

export async function initDatabaseAction() {
    try {
        const result = await initDatabase();
        if (!result) {
            return { success: false, error: "Initialization failed" };
        }
        revalidateTag("labs");
        revalidateTag("stories");
        revalidateTag("tags");
        return result;
    } catch (error) {
        console.error("Error during database initialization:", error);
        return { success: false, error };
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
