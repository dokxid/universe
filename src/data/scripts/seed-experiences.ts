"use server";

import { seedElevationRequests } from "@/data/scripts/seed-elevation-requests";
import { seedLabImages } from "@/data/scripts/seed-images";
import { seedStories } from "@/data/scripts/seed-stories";
import {
    stock_experiences_doc,
    test_experiences_doc,
    universe_experience_doc,
} from "@/data/scripts/seeds/experiences-seeds";
import dbConnect from "@/lib/data/mongodb/connections";
import ExperienceModel from "@/lib/data/mongodb/models/experience-model";

export async function seedExperiences(center: number[]) {
    await dbConnect();
    await ExperienceModel.deleteMany({});

    // seed stock experiences
    const result_stock_experiences = await ExperienceModel.insertMany(
        stock_experiences_doc
    );
    console.log(`Inserted ${result_stock_experiences.length} experiences`);

    // seed test experience
    const test_experience = test_experiences_doc(center);
    const result_test_experience = await ExperienceModel.insertOne(
        test_experience
    );
    console.log(
        `Inserted test experience with id ${result_test_experience.insertedId}`
    );

    // seed universe experience
    const universe_experience = universe_experience_doc();
    const result_universe_experience = await ExperienceModel.insertOne(
        universe_experience
    );
    console.log(
        `Inserted universe experience with id ${result_universe_experience.insertedId}`
    );

    console.log("Experiences seeded successfully");
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
        const testExperience = test_experiences_doc(center);
        const generatedExperience = {
            ...testExperience,
            title: title,
            slug: slug,
            description: description,
            subtitle: subtitle,
            initial_zoom: initialZoom,
            organizationId: organizationId,
        };
        await dbConnect();
        const result = await ExperienceModel.insertOne(generatedExperience);
        console.log(`Inserted experience with id ${result.insertedId}`);
        await seedStories(slug, center, experienceStories);
        console.log("Stories seeding completed");
        await seedElevationRequests(slug);
        console.log("Elevation requests seeding completed");
        await seedLabImages(slug);
        console.log("Lab images seeding completed");
        console.log("Single experience seeding completed");
        return result.insertedId;
    } catch (error) {
        console.error("Error inserting experience:", error);
        throw error;
    }
}
