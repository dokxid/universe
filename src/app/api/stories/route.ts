import {clientPromise} from "@/lib/mongodb/connections";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {fromEnv} from "@aws-sdk/credential-provider-env";
import {errorSanitizer} from "@/lib/utils/errorSanitizer";


const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: fromEnv(),
})

async function uploadFile(file: File, key: string, slug: string): Promise<void> {
    try {

        // Convert File to Buffer using the stream() method
        const bytes = await file.stream();
        const chunks = [];

        // Read all chunks from the stream
        const reader = bytes.getReader();
        while (true) {
            const {done, value} = await reader.read();
            if (done) break;
            chunks.push(value);
        }

        // Combine all chunks into a single Buffer
        const buffer = Buffer.concat(chunks.map(chunk => Buffer.from(chunk)));

        // Upload the Buffer to S3
        await s3Client.send(new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Body: buffer,
            Key: `${slug}/${key}`,
            ContentType: file.type,
            ContentLength: file.size,
        }));

    } catch (err) {
        console.error(`Failed to upload ${key}:`, err);
        throw err;
    }
}

export async function GET() {
    const client = await clientPromise;
    const db = client.db("hl-universe");
    const storyCollection = db.collection("stories");

    const stories = await storyCollection.find({}).toArray();
    return Response.json(stories)
}

export async function POST(request: Request) {

    const client = await clientPromise;
    const db = client.db("hl-universe");
    const storyCollection = db.collection("stories");
    const data = await request.formData()

    const file = data.get("featuredImage") as File;
    const uploadedFileName = `${data.get("experience")}_${file.name}`

    const storyToInsert = {
        author: data.get("author"),
        content: data.get("content"),
        title: data.get("title"),
        latitude: parseInt(<string>data.get("latitude")),
        longitude: parseInt(<string>data.get("longitude")),
        tags: JSON.parse(<string>data.get("tags")),
        year: parseInt(<string>data.get("year")),
        featuredImage: uploadedFileName,
        experience: data.get("experience"),
    }

    // console.log(storyToInsert)

    try {
        await uploadFile(file, uploadedFileName, data.get("experience") as string)
        await storyCollection.insertOne(storyToInsert);
    } catch (e) {
        return errorSanitizer(e)
    }

    return new Response("", {status: 200})
}