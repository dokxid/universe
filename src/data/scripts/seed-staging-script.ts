import { seedDatabase } from "@/data/scripts/seed-database";

export async function seedStagingScript(
    numRandomCityCenters: number,
    numStories: number,
) {
    try {
        console.log("step 2: seeding...");
        await seedDatabase(numRandomCityCenters, numStories);
        console.log("Database seeding completed successfully... disconnecting");
        process.exit(0);
    } catch (error) {
        console.error("Error during database seeding:", error);
        process.exit(1);
    }
}

seedStagingScript(5, 20);
