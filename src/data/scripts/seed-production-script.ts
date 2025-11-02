import { initDatabase } from "@/data/scripts/seed-database";

export async function seedProductionScript() {
    try {
        console.log("Starting database seeding...");
        console.log("step 1: initializing...");
        await initDatabase();
        console.log("Database seeding completed successfully");
        process.exit(0);
    } catch (error) {
        console.error("Error during database seeding:", error);
        process.exit(1);
    }
}

seedProductionScript();
