import { getExperienceDTO } from "@/data/dto/experience-dto";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    ctx: RouteContext<"/api/experiences/[slug]">
) {
    const { slug } = await ctx.params;
    const experience = await getExperienceDTO(slug);

    return Response.json(experience);
}
