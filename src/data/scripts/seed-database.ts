import { seedElevationRequests } from "@/data/scripts/seed-elevation-requests";
import { seedExperiences } from "@/data/scripts/seed-experiences";
import { seedImages } from "@/data/scripts/seed-images";
import { seedStories } from "@/data/scripts/seed-stories";
import { seedUnescoTags } from "@/data/scripts/seed-unesco";

// in lat, lon
const city_centers: { [key: string]: number[] } = {
    tallinn: [24.7505, 59.4443],
    oslo: [10.7522, 59.9139],
};

async function seedDatabase() {
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
        await seedUnescoTags();
        await seedImages();
        await seedExperiences(city_centers["oslo"]);
        await seedStories("test", city_centers["oslo"], 40);
        await seedElevationRequests();
        console.log("Database seeding completed");
    } catch (error) {
        console.error("Error during database seeding:", error);
    } finally {
        process.exit();
    }
}

seedDatabase();
