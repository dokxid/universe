import { getSignedS3URL } from "@/lib/data/uploader/s3";

export async function getImageURLAction(
    experience: string,
    fileName: string
): Promise<string> {
    try {
        if (process.env.LOCAL_UPLOADER === "true") {
            return new URL(`/uploads/${experience}/${fileName}`).toString();
        } else {
            return await getSignedS3URL(experience, fileName);
        }
    } catch (error) {
        console.error("Error fetching image:", error);
        throw new Error("Failed to fetch image URL");
    }
}
