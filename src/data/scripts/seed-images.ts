import fs from "fs";
fs.rmSync("public/uploads", { recursive: true, force: true });
fs.cpSync("src/data/scripts/seeds/images", "public/uploads", {
    recursive: true,
});
