"use server";

import { seedElevationRequests } from "@/data/scripts/seed-elevation-requests";
import { seedLabStoryImages } from "@/data/scripts/seed-images";
import { seedStories } from "@/data/scripts/seed-stories";
import {
    stock_labs_doc,
    test_lab_doc,
    universe_lab_doc,
} from "@/data/scripts/seeds/lab-seeds";
import { prisma } from "@/lib/data/prisma/connections";
import { faker } from "@faker-js/faker";


export async function seedLabs(cityCenters: number[][]) {

    // seed stock labs 
    const result_stock_labs = await prisma.lab.createMany({
        data: stock_labs_doc,
    });
    console.log(`Inserted ${result_stock_labs.count} labs`);

    // create unique slugs
    const uniqueSlugArray = faker.helpers.uniqueArray(
        faker.word.adverb,
        cityCenters.length - 1
    );
    uniqueSlugArray.push("test");

    // create labs for each city center
    await Promise.all(
        cityCenters.map(async (center, index) => {
            const test_lab = await test_lab_doc(
                uniqueSlugArray[index],
                center
            );
            const result_test_lab = await prisma.lab.create({
                data: test_lab,
            });
            console.log(
                `Inserted test lab with id ${result_test_lab.id}`
            );
        })
    );

    console.log("labs seeded successfully");
}

export async function seedUniverseLab() {
    try {
        // seed universe lab 
        const universe_lab = universe_lab_doc();
        const result_universe_lab = await prisma.lab.create({
            data: universe_lab,
        });
        console.log(
            `Inserted universe lab with id ${result_universe_lab.id}`
        );
    } catch (error) {
        console.error("Error inserting universe lab:", error);
    }
}

export async function seedOneLab(
    center: number[],
    title: string,
    slug: string,
    description: string,
    subtitle: string,
    initialZoom: number,
    organizationId: string,
    labStories: number
) {
    try {
        // const user = await getCurrentUser();
        // if ((await isUserSuperAdmin(user)) === false) {
        //     throw new Error("Only super admins can seed the database");
        // }
        const testLab = await test_lab_doc(slug, center);
        const generatedLab = {
            ...testLab,
            title: title,
            slug: slug,
            description: description,
            subtitle: subtitle,
            initial_zoom: initialZoom,
            organizationId: organizationId,
        };
        const result = await prisma.lab.create({ data: generatedLab });
        console.log(`Inserted lab with id ${result.id}`);
        await seedStories(slug, center, labStories);
        console.log("Stories seeding completed");
        await seedElevationRequests({ lab: { slug } });
        console.log("Elevation requests seeding completed");
        await seedLabStoryImages(slug);
        console.log("Lab images seeding completed");
        console.log("Single lab seeding completed");
        return result.id;
    } catch (error) {
        console.error("Error inserting lab:", error);
        throw error;
    }
}
