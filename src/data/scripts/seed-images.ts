"use server";

import { prisma } from "@/lib/data/prisma/connections";
import fs from "fs";


export async function initializeFeaturedLabImages() {
    try {
        if (process.env.LOCAL_UPLOADER !== "true") {
            console.log(
                "Featured Lab Images: Skipping seeding of images in non-local environment"
            );
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
            console.log(
                "Story Images: Skipping seeding of images in non-local environment"
            );
            return;
        }
        const allLabs = await prisma.lab.findMany({});
        await Promise.all(
            allLabs.map(async (lab) => {
                await initializeLabImageFolders(lab.slug);
                console.log("Inserted images for lab: " + lab.slug);
            })
        );
        console.log("Image seeding completed");
    } catch (error) {
        console.error("Error seeding images:", error);
    }
}

export async function seedLabStoryImages(slug: string) {
    try {
        const result = await prisma.lab.findUnique({ where: { slug } });
        if (!result) {
            throw new Error("Lab not found with slug: " + slug);
        }
        initializeLabImageFolders(result.slug);
    } catch (error) {
        console.error("Error seeding images:", error);
    }
}
