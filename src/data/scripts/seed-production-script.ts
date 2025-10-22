import { initDatabase } from "@/data/scripts/seed-database";

export async function seedProductionScript() {
    try {
        console.log("Starting database seeding...");
        await initDatabase();
        console.log("Database seeding completed successfully");
        process.exit(0);
    } catch (error) {
        console.error("Error during database seeding:", error);
        process.exit(1); // Add this to exit on error
    }
}

seedProductionScript();
