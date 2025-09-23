import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    region: process.env.AWS_REGION,
});

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string; name: string }> }
): Promise<Response> {
    const { slug, name } = await params;

    try {
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: slug + "/" + name,
        });

        const url = await getSignedUrl(s3, command);

        return new NextResponse(JSON.stringify({ url }), {
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error fetching image from S3:", error);
        return new NextResponse(
            JSON.stringify({ error: "Error fetching image from S3" }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
}
