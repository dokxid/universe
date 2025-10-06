"use server";

import { faker } from "@faker-js/faker";
import fs from "fs";

export async function getImagesInSeedsFolder() {
    return fs.promises.readdir("src/data/scripts/seeds/images");
}

export async function getImageUrls() {
    const allLabImages = await getImagesInSeedsFolder();
    const filename = faker.helpers.arrayElement(allLabImages);
    return `http://localhost:3000/uploads/labs/featured/${filename}`;
}
