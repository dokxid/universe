import { getTagsDTO } from "@/data/dto/tag-dto";

export async function GET() {
    const tags = await getTagsDTO();
    return Response.json(tags);
}
