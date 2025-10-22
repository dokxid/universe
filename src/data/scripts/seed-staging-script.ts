import { seedDatabase } from "@/data/scripts/seed-database";

export async function seedStagingScript(
    numRandomCityCenters: number,
    numStories: number
) {
    // ensure we are running on a test database
    if (
        process.env.MONGODB_DBNAME !== "test" &&
        process.env.MONGODB_DBNAME !== "universe-staging"
    ) {
        throw new Error(
            "Seeding can only be run on a test database. Current DB: " +
                process.env.MONGODB_DBNAME
        );
    }
    try {
        await seedDatabase(numRandomCityCenters, numStories);
        fetch("http://localhost:3000/api/revalidate-all");
        process.exit(0);
    } catch (error) {
        console.error("Error during database seeding:", error);
    }
}

seedStagingScript(5, 20);
