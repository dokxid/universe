import { getExperienceDTO } from "@/data/dto/experience-dto";

const a = await getExperienceDTO("test");

export async function GET() {
    return new Response(JSON.stringify(a), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
