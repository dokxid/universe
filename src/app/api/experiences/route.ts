import { getExperiencesDTO } from "@/data/dto/experience-dto";

export async function GET() {
    const experiences = await getExperiencesDTO();
    return Response.json(experiences);
}
