import "server-only";

import { getCurrentUser, isUserSuperAdmin } from "@/data/auth";
import { seedDatabase } from "@/data/scripts/seed-database";
import { revalidateTag } from "next/cache";

export async function startSeedingDatabase(
    numRandomCityCenters: number,
    numStories: number
) {
    // ensure we are running on a test database
    if (
        process.env.MONGODB_DBNAME !== "test" &&
        process.env.MONGODB_DBNAME !== "hl-universe-staging"
    ) {
        throw new Error(
            "Seeding can only be run on a test database. Current DB: " +
                process.env.MONGODB_DBNAME
        );
    }
    try {
        const user = await getCurrentUser();
        if ((await isUserSuperAdmin(user)) === false) {
            throw new Error("Only super admins can seed the database");
        }
        await seedDatabase(numStories, numRandomCityCenters);
        revalidateTag("experiences");
        revalidateTag("stories");
        revalidateTag("tags");
    } catch (error) {
        console.error("Error during database seeding:", error);
    }
}
