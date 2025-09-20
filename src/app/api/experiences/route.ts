import { getExperiencesDTO } from "@/data/dto/story-dto";

export async function GET() {
    const experiences = JSON.parse(await getExperiencesDTO())
    return Response.json(experiences);
}
