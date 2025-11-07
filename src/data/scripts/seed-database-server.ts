import "server-only";

import { isUserSuperAdmin } from "@/data/auth";
import { initDatabase, seedDatabase } from "@/data/scripts/seed-database";
import { revalidateTag } from "next/cache";

export async function startSeedingDatabase(
    numRandomCityCenters: number,
    numStories: number
) {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not defined in environment variables");
    }
    // ensure we are running on a not production database
    if (
        process.env.DATABASE_URL.endsWith("universe-production")
    ) {
        throw new Error(
            "Seeding can only be run on a test database. Current DB: " +
            process.env.DATABASE_URL
        );
    }
    try {
        if ((await isUserSuperAdmin()) === false) {
            throw new Error("Only super admins can seed the database");
        }
        await initDatabase();
        await seedDatabase(numStories, numRandomCityCenters);
        revalidateTag("labs");
        revalidateTag("stories");
        revalidateTag("tags");
        return { success: true, error: null };
    } catch (error) {
        console.error("Error during database seeding:", error);
    }
}
