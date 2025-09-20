import { S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-provider-env";
import { errorSanitizer } from "@/lib/utils/errorSanitizer";
import { getPublicStoriesDTO } from "@/data/dto/story-dto";

export async function GET() {
    const stories = JSON.parse(await getPublicStoriesDTO());
    return Response.json(stories);
}
