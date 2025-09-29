import fs from "fs";

export function seedImages() {
    fs.rmSync("public/uploads", { recursive: true, force: true });
    fs.cpSync("src/data/scripts/seeds/images", "public/uploads", {
        recursive: true,
    });
    console.log("Images seeded successfully");
}
