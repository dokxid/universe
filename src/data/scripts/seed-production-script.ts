import { initDatabase } from "@/data/scripts/seed-database";

export async function seedProductionScript() {
    try {
        await initDatabase();
        process.exit(0);
    } catch (error) {
        console.error("Error during database seeding:", error);
    }
}

seedProductionScript();
