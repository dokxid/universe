import { initDatabase } from "@/data/scripts/seed-database";

export async function seedProductionScript() {
    // ensure we are running on a test database
    try {
        await initDatabase();
        fetch("http://localhost:3000/api/revalidate-all");
        process.exit(0);
    } catch (error) {
        console.error("Error during database seeding:", error);
    }
}

seedProductionScript();
