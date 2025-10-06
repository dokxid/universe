"use server";

import { getSignedS3URL } from "@/lib/data/uploader/s3";

export async function getImageURLAction(
    slug: string,
    fileName: string
): Promise<string> {
    try {
        if (process.env.LOCAL_UPLOADER === "true") {
            return `/uploads/${slug}/story-img/${fileName}`;
        } else {
            if (fileName.startsWith("http")) {
                return fileName;
            } else {
                return await getSignedS3URL(slug, fileName);
            }
        }
    } catch (error) {
        console.error("Error fetching image:", error);
        throw new Error("Failed to fetch image URL");
    }
}
