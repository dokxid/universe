import { getAllPublicStoriesDTO } from "@/data/dto/story-dto";

export async function GET() {
    const stories = await getAllPublicStoriesDTO();
    return Response.json(stories);
}
