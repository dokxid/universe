"use server";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-provider-env";
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
            region,
            credentials: fromEnv(),
        });
    }
    return s3Client;
};

async function fileToBuffer(file: File): Promise<Buffer> {
    const bytes = await file.stream();
    const chunks = [];

    const reader = bytes.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
    }

    return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
}

export async function uploadFile(
    file: File,
    key: string,
    slug: string
): Promise<void> {
    try {
        const { bucket } = getS3Config();
        const client = getS3Client();
        const buffer = await fileToBuffer(file);

        await client.send(
            new PutObjectCommand({
                Bucket: bucket,
                Body: buffer,
                Key: `${slug}/${key}`,
                ContentType: file.type,
                ContentLength: file.size,
            })
        );
    } catch (err) {
        console.error(`Failed to upload ${key}:`, err);
        throw err;
    }
}

export async function uploadPublicFile(file: File): Promise<string> {
    const key = nanoid() + "-" + file.name;
    try {
        const { region, bucket } = getS3Config();
        const client = getS3Client();
        const buffer = await fileToBuffer(file);

        await client.send(
            new PutObjectCommand({
                Bucket: bucket,
                Body: buffer,
                Key: `public/${key}`,
                ContentType: file.type,
                ContentLength: file.size,
            })
        );

        const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`;
        console.log("File uploaded to:", url);
        return url;
    } catch (err) {
        console.error(`Failed to upload ${key}:`, err);
        throw err;
    }
}
