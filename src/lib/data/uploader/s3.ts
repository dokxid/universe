"use server";

import {
    generateUniqueFileName,
    sanitizeFileName,
} from "@/lib/utils/file-sanitizer";
import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-provider-env";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";

// Lazy validation - only validate when needed
const getS3Config = () => {
    if (!process.env.AWS_REGION) {
        throw new Error("AWS_REGION not set in environment");
    }
    if (!process.env.AWS_BUCKET_NAME) {
        throw new Error("AWS_BUCKET_NAME not set in environment");
    }
    return {
        region: process.env.AWS_REGION,
        bucket: process.env.AWS_BUCKET_NAME,
    };
};

// Lazy S3 client creation
let s3Client: S3Client | null = null;

const getS3Client = () => {
    if (!s3Client) {
        const { region } = getS3Config();
        s3Client = new S3Client({
            endpoint: process.env.AWS_S3_ENDPOINT || undefined,
            region,
            credentials: fromEnv(),
            forcePathStyle: true, // Needed for Garage and some S3-compatible services
        });
    }
    return s3Client;
};

async function fileToBuffer(file: File): Promise<Buffer> {
    try {
        const bytes = await file.stream();
        const chunks = [];

        const reader = bytes.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
        }

        return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
    } catch (error) {
        console.error(
            "Error converting file to buffer:",
            error instanceof Error ? error.message : error
        );
        throw new Error("Failed to convert file to buffer");
    }
}

export async function uploadFile(file: File, prefix?: string): Promise<string> {
    try {
        const { bucket } = getS3Config();
        const client = getS3Client();
        const buffer = await fileToBuffer(file);
        const sanitizedKey = sanitizeFileName(file.name);
        const key = generateUniqueFileName(sanitizedKey, prefix);

        await client.send(
            new PutObjectCommand({
                Bucket: bucket,
                Body: buffer,
                Key: `${key}`,
                ContentType: file.type,
                ContentLength: file.size,
            })
        );
        const url = `${process.env.BETTER_AUTH_URL ||
            "http://localhost:3000"
            }/api/files/${key}`;
        return url;
    } catch (error) {
        console.error(
            `Failed to upload ${file.name}:`,
            error instanceof AggregateError
                ? error.errors
                    .map((e) => (e instanceof Error ? e.message : e))
                    .join(", ")
                : error instanceof Error
                    ? error.message
                    : error
        );
        throw error;
    }
}

export async function uploadFileToPublicS3(file: File): Promise<string> {
    const key = nanoid() + "-" + file.name;
    try {
        const { bucket } = getS3Config();
        const client = getS3Client();
        const buffer = await fileToBuffer(file);

        await client.send(
            new PutObjectCommand({
                Bucket: bucket,
                Body: buffer,
                Key: `${key}`,
                ContentType: file.type,
                ContentLength: file.size,
            })
        );
        const url = `${process.env.BETTER_AUTH_URL ||
            "http://localhost:3000"
            }/api/files/${key}`;
        console.log("File uploaded to:", url);
        return url;
    } catch (error) {
        console.error(
            `Failed to upload ${key}:`,
            error instanceof Error ? error.message : error
        );
        throw error;
    }
}

export async function getSignedS3URL(name: string): Promise<string> {
    try {
        const { bucket } = getS3Config();
        const client = getS3Client();
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: name,
        });
        const signedUrl = await getSignedUrl(client, command);
        return signedUrl;
    } catch (error) {
        console.error(
            "Error fetching image from S3:",
            error instanceof Error ? error.message : error
        );
        throw new Error("Error fetching image from S3");
    }
}
