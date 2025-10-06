"use server";

import dbConnect from "@/lib/data/mongodb/connections";
import experiences from "@/lib/data/mongodb/models/experience-model";
import { Experience } from "@/types/dtos";
import fs from "fs";

export async function initializeFeaturedLabImages() {
    try {
        if (process.env.LOCAL_UPLOADER !== "true") {
            console.log("Skipping seeding of images in non-local environment");
            return;
        }
        await fs.promises.rm(`public/uploads/labs/featured`, {
            recursive: true,
            force: true,
        });
        await fs.promises.mkdir(`public/uploads/labs/featured`, {
            recursive: true,
        });
        await fs.promises.cp(
            `src/data/scripts/seeds/images`,
            `public/uploads/labs/featured`,
            {
                recursive: true,
            }
        );
        console.log("Featured images copied successfully");
    } catch (error) {
        console.error("Error seeding featured images:", error);
    }
}

export async function deleteUploadsFolder() {
    try {
        if (process.env.LOCAL_UPLOADER !== "true") {
            console.log(
                "Skipping deletion of uploads folder in non-local environment"
            );
            return;
        }
        await fs.promises.rm(`public/uploads`, {
            recursive: true,
            force: true,
        });
        console.log("Uploads folder deleted successfully");
    } catch (error) {
        console.error("Error deleting uploads folder:", error);
    }
}

async function initializeLabImageFolders(slug: string) {
    try {
        if (process.env.LOCAL_UPLOADER !== "true") {
            console.log("Skipping seeding of images in non-local environment");
            return;
        }
        await fs.promises.rm(`public/uploads/${slug}/story-img`, {
            recursive: true,
            force: true,
        });
        await fs.promises.mkdir(`public/uploads/${slug}/story-img`, {
            recursive: true,
        });
        await fs.promises.cp(
            "src/data/scripts/seeds/images",
            `public/uploads/${slug}/story-img`,
            {
                recursive: true,
            }
        );
        console.log("Images seeded successfully");
    } catch (error) {
        console.error("Error seeding images:", error);
    }
}

export async function seedAllStoryImages() {
    try {
        if (process.env.LOCAL_UPLOADER !== "true") {
            console.log("Skipping seeding of images in non-local environment");
            return;
        }
        await dbConnect();
        const allExperiences = (await experiences.find({})) as Experience[];
        await Promise.all(
            allExperiences.map(async (experience) => {
                await initializeLabImageFolders(experience.slug);
                console.log(
                    "Inserted images for experience: " + experience.slug
                );
            })
        );
        console.log("Image seeding completed");
    } catch (error) {
        console.error("Error seeding images:", error);
    }
}

export async function seedLabStoryImages(slug: string) {
    try {
        await dbConnect();
        experiences.findOne({ slug }).then((experience) => {
            initializeLabImageFolders(experience.slug);
        });
    } catch (error) {
        console.error("Error seeding images:", error);
    }
}
