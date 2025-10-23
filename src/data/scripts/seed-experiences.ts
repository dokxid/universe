"use server";

import { seedElevationRequests } from "@/data/scripts/seed-elevation-requests";
import { seedLabStoryImages } from "@/data/scripts/seed-images";
import { seedStories } from "@/data/scripts/seed-stories";
import {
    stock_experiences_doc,
    test_experiences_doc,
    universe_experience_doc,
} from "@/data/scripts/seeds/experiences-seeds";
import { PrismaClient } from "@/generated/prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

export async function seedExperiences(cityCenters: number[][]) {
    await prisma.lab.deleteMany();

    // seed stock experiences
    const result_stock_experiences = await prisma.lab.createMany({
        data: stock_experiences_doc,
    });
    console.log(`Inserted ${result_stock_experiences.count} experiences`);

    // create unique slugs
    const uniqueSlugArray = faker.helpers.uniqueArray(
        faker.word.adverb,
        cityCenters.length - 1
    );
    uniqueSlugArray.push("test");

    // create experiences for each city center
    await Promise.all(
        cityCenters.map(async (center, index) => {
            const test_experience = await test_experiences_doc(
                uniqueSlugArray[index],
                center
            );
            const result_test_experience = await prisma.lab.create({
                data: test_experience,
            });
            console.log(
                `Inserted test experience with id ${result_test_experience.id}`
            );
        })
    );

    await seedUniverseLab();
    console.log("Experiences seeded successfully");
}

export async function seedUniverseLab() {
    try {
        // seed universe experience
        const universe_experience = universe_experience_doc();
        const result_universe_experience = await prisma.lab.create({
            data: universe_experience,
        });
        console.log(
            `Inserted universe experience with id ${result_universe_experience.id}`
        );
    } catch (error) {
        console.error("Error inserting universe experience:", error);
    }
}

export async function seedOneExperience(
    center: number[],
    title: string,
    slug: string,
    description: string,
    subtitle: string,
    initialZoom: number,
    organizationId: string,
    experienceStories: number
) {
    try {
        // const user = await getCurrentUser();
        // if ((await isUserSuperAdmin(user)) === false) {
        //     throw new Error("Only super admins can seed the database");
        // }
        const testExperience = await test_experiences_doc(slug, center);
        const generatedExperience = {
            ...testExperience,
            title: title,
            slug: slug,
            description: description,
            subtitle: subtitle,
            initial_zoom: initialZoom,
            organizationId: organizationId,
        };
        const result = await prisma.lab.create({ data: generatedExperience });
        console.log(`Inserted experience with id ${result.id}`);
        await seedStories(slug, center, experienceStories);
        console.log("Stories seeding completed");
        await seedElevationRequests(slug);
        console.log("Elevation requests seeding completed");
        await seedLabStoryImages(slug);
        console.log("Lab images seeding completed");
        console.log("Single experience seeding completed");
        return result.id;
    } catch (error) {
        console.error("Error inserting experience:", error);
        throw error;
    }
}
