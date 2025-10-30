import { seedDatabase } from "@/data/scripts/seed-database";

export async function seedStagingScript(
    numRandomCityCenters: number,
    numStories: number,
) {
    try {
        await seedDatabase(numRandomCityCenters, numStories);
        fetch("http://localhost:3000/api/revalidate-all");
        process.exit(0);
    } catch (error) {
        console.error("Error during database seeding:", error);
    }
}

seedStagingScript(5, 20);
