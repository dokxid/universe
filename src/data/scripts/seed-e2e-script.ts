import { seedCypressUsers } from "./seed-users";

async function seedE2E() {
    try {
        await seedCypressUsers();
        process.exit(0);
    } catch (error) {
        console.error("Error during database seeding:", error);
    }
}

seedE2E();
