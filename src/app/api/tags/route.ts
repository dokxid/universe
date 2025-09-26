import { getTagsDTO } from "@/data/dto/getTagsDTO";

export async function GET() {
    const tags = await getTagsDTO();
    return Response.json(tags);
}
