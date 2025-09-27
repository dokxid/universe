import fs from "fs";

export function getImagesInFolder() {
    return fs.readdirSync("src/data/scripts/seeds/images");
}
