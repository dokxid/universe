"use server";

import fs from "fs";

export async function getImagesInFolder() {
    return fs.promises.readdir("src/data/scripts/seeds/images");
}
