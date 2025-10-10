"use server";

import { faker } from "@faker-js/faker";
import fs from "fs";

export async function getImagesInSeedsFolder() {
    return fs.promises.readdir("src/data/scripts/seeds/images");
}

export async function getStoryImageUrl(experience: string) {
    const allImages = await getImagesInSeedsFolder();
    const filename = faker.helpers.arrayElement(allImages);
    return process.env.LOCAL_UPLOADER === "true"
        ? `http://localhost:3000/uploads/${experience}/story-img/${filename}`
        : `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${experience}/story-img/${filename}`;
}

export async function getLocalFeaturedLabImageUrl() {
    const allLabImages = await getImagesInSeedsFolder();
    const filename = faker.helpers.arrayElement(allLabImages);
    return `http://localhost:3000/uploads/labs/featured/${filename}`;
}
