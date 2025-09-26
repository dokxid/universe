import { seedUnescoTags } from "@/data/scripts/seed-unesco";

seedUnescoTags()
    .then(() => console.log("Database seeding completed"))
    .catch((error) => {
        console.error("Error during database seeding:", error);
        process.exit(1);
    })
    .finally(() => process.exit());
