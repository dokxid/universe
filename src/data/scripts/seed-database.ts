import { seedElevationRequests } from "@/data/scripts/seed-elevation-requests";
import {
    seedExperiences,
    seedUniverseLab,
} from "@/data/scripts/seed-experiences";
import { seedAllStories } from "@/data/scripts/seed-stories";
import { seedUnescoTags } from "@/data/scripts/seed-unesco";
import { seedUsers } from "@/data/scripts/seed-users";
import { PrismaClient } from "@/generated/prisma/client";
import { faker } from "@faker-js/faker";

// in lat, lon
const city_centers: { [key: string]: number[] } = {
    tallinn: [24.7505, 59.4443],
    oslo: [10.7522, 59.9139],
    stockholm: [18.0686, 59.3293],
    copenhagen: [12.5683, 55.6761],
    helsinki: [24.9384, 60.1699],
    reykjavik: [-21.8174, 64.1466],
    berlin: [13.405, 52.52],
    paris: [2.3522, 48.8566],
    london: [-0.1276, 51.5074],
    amsterdam: [4.9041, 52.3676],
    rome: [12.4964, 41.9028],
    madrid: [3.7038, 40.4168],
    barcelona: [2.1734, 41.3851],
    vienna: [16.3738, 48.2082],
    prague: [14.4378, 50.0755],
    budapest: [19.0402, 47.4979],
    warsaw: [21.0122, 52.2297],
    moscow: [37.6176, 55.7558],
    st_petersburg: [30.3351, 59.9311],
    kyiv: [30.5234, 50.4501],
    // istanbul: [28.9784, 41.0082],
    athens: [23.7275, 37.9755],
    lisbon: [-9.1393, 38.7223],
    dublin: [-6.2603, 53.3498],
    edinburgh: [-3.1883, 55.9533],
    zurich: [8.5417, 47.3769],
    geneva: [6.1432, 46.2044],
    brussels: [4.3517, 50.8503],
    luxembourg: [6.1296, 49.8116],
};

const prisma = new PrismaClient();

export async function seedDatabase(
    numRandomCityCenters: number,
    numStories: number,
) {
    try {
        // tear down in order
        await prisma.invitation.deleteMany({});
        await prisma.elevationRequest.deleteMany({});
        await prisma.story.deleteMany({});
        await prisma.lab.deleteMany({});

        const cities = Object.values(city_centers);
        const randomCityCenters = faker.helpers.arrayElements(
            cities,
            numRandomCityCenters,
        );

        // await deleteUploadsFolder();
        await seedUnescoTags();
        await seedExperiences(randomCityCenters);
        await seedUsers(10, 1);
        // await seedAllStoryImages();
        // await initializeFeaturedLabImages();
        await seedAllStories(numStories);
        await seedElevationRequests();
        console.log("Database seeding completed");
    } catch (error) {
        console.error("Error during database seeding:", error);
        throw error;
    }
}

export async function initDatabase() {
    try {
        await seedUnescoTags();
        await seedUniverseLab();
    } catch (error) {
        console.error("Error during database initialization:", error);
        throw error;
    }
}
