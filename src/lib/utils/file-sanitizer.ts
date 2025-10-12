import { nanoid } from "nanoid";

export function sanitizeFileName(uploadedFileName: string): string {
    const sanitizedFileName = uploadedFileName.replace(/[^a-zA-Z0-9.\-_]/g, "");
    return sanitizedFileName;
}

export function generateUniqueFileName(
    originalFileName: string,
    prefix?: string
): string {
    return `${prefix ? prefix + "_" : ""}${nanoid()}_${sanitizeFileName(
        originalFileName
    )}`;
}
