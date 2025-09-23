import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-provider-env";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: fromEnv(),
});

export async function uploadFile(
    file: File,
    key: string,
    slug: string
): Promise<void> {
    try {
        // Convert File to Buffer using the stream() method
        const bytes = await file.stream();
        const chunks = [];

        // Read all chunks from the stream
        const reader = bytes.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
        }

        // Combine all chunks into a single Buffer
        const buffer = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));

        // Upload the Buffer to S3
        await s3Client.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
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
