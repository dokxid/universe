"use server";

import { generateUniqueFileName } from "@/lib/utils/file-sanitizer";
import fs from "fs";

const UPLOAD_DIRECTORY = "./public/uploads";

export async function uploadFileToPublicFolder(
    file: File,
    prefix?: string
): Promise<string> {
    try {
        if (!fs.existsSync(UPLOAD_DIRECTORY)) {
            fs.mkdir(UPLOAD_DIRECTORY, { recursive: true }, (err) => {
                if (err) {
                    console.error("Error creating upload directory:", err);
                }
            });
        }
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
        const key = generateUniqueFileName(sanitizedFileName, prefix);
        const filePath = `${UPLOAD_DIRECTORY}/${key}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        await fs.promises.writeFile(filePath, buffer);
        return `/uploads/${key}`;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("File upload failed");
    }
}

export async function uploadFileToLabFolder(
    file: File,
    slug: string
): Promise<string> {
    try {
        if (!fs.existsSync(`${UPLOAD_DIRECTORY}/${slug}`)) {
            fs.mkdir(
                `${UPLOAD_DIRECTORY}/${slug}`,
                { recursive: true },
                (err) => {
                    if (err) {
                        console.error("Error creating upload directory:", err);
                    }
                }
            );
        }
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
        const key = generateUniqueFileName(sanitizedFileName, slug);
        const filePath = `${UPLOAD_DIRECTORY}/${key}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        await fs.promises.writeFile(filePath, buffer);
        return `/uploads/${key}`;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("File upload failed");
    }
}
