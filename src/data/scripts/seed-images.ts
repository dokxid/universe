"use server";

import dbConnect from "@/lib/data/mongodb/connections";
import experiences from "@/types/models/experiences";
import fs from "fs";

async function seedLabImageFolder(slug: string) {
    try {
        await fs.promises.rm(`public/uploads/${slug}`, {
            recursive: true,
            force: true,
        });
        await fs.promises.cp(
            "src/data/scripts/seeds/images",
            `public/uploads/${slug}`,
            {
                recursive: true,
            }
        );
        console.log("Images seeded successfully");
    } catch (error) {
        console.error("Error seeding images:", error);
    }
}

export async function seedAllImages() {
    try {
        await dbConnect();
        experiences.find({}).then((allExperiences) => {
            allExperiences.forEach((experience) => {
                seedLabImageFolder(experience.slug);
            });
        });
    } catch (error) {
        console.error("Error seeding images:", error);
    }
}

export async function seedLabImages(slug: string) {
    try {
        await dbConnect();
        experiences.findOne({ slug }).then((experience) => {
            seedLabImageFolder(experience.slug);
        });
    } catch (error) {
        console.error("Error seeding images:", error);
    }
}
