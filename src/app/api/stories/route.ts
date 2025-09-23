import { getPublicStoriesDTO } from "@/data/dto/story-dto";

export async function GET() {
    const stories = JSON.parse(await getPublicStoriesDTO());
    return Response.json(stories);
}
