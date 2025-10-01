import { seedAllElevationRequests } from "@/data/scripts/seed-elevation-requests";
import { seedExperiences } from "@/data/scripts/seed-experiences";
import { seedAllImages } from "@/data/scripts/seed-images";
import { seedStories } from "@/data/scripts/seed-stories";
import { seedUnescoTags } from "@/data/scripts/seed-unesco";

// TODO: fix duplicate technical debt
const city_centers: { [key: string]: number[] } = {
    tallinn: [24.7505, 59.4443],
    oslo: [10.7522, 59.9139],
};

export async function seedDatabaseScript(numStories: number) {
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
        await seedExperiences(city_centers["oslo"]);
        await seedAllImages();
        await seedStories("test", city_centers["oslo"], numStories);
        await seedAllElevationRequests();
        console.log("Database seeding completed");
        process.exit(0);
    } catch (error) {
        console.error("Error during database seeding:", error);
    }
}

seedDatabaseScript(50);
