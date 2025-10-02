"use server";

import fs from "fs";
import { nanoid } from "nanoid";

const UPLOAD_DIRECTORY = "./public/uploads";

export async function uploadFileToPublicFolder(file: File): Promise<string> {
    try {
        if (!fs.existsSync(UPLOAD_DIRECTORY)) {
            fs.mkdir(UPLOAD_DIRECTORY, { recursive: true }, (err) => {
                if (err) {
                    console.error("Error creating upload directory:", err);
                }
            });
        }
        const key = nanoid() + "-" + file.name;
        const filePath = `${UPLOAD_DIRECTORY}/${key}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        await fs.promises.writeFile(filePath, buffer);
        return `/story-uploads/${key}`;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("File upload failed");
    }
}

export async function uploadFileToLabFolder(
    file: File,
    fileName: string,
    slug: string
): Promise<string> {
    try {
        if (!fs.existsSync(`UPLOAD_DIRECTORY/${slug}`)) {
            fs.mkdir(`UPLOAD_DIRECTORY/${slug}`, { recursive: true }, (err) => {
                if (err) {
                    console.error("Error creating upload directory:", err);
                }
            });
        }
        const filePath = `${UPLOAD_DIRECTORY}/${slug}/${fileName}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        await fs.promises.writeFile(filePath, buffer);
        return `/story-uploads/${slug}/${fileName}`;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("File upload failed");
    }
}
