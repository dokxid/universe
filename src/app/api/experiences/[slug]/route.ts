import {clientPromise} from "@/lib/mongodb/connections";
import {NextRequest} from "next/server";


export async function GET(req: NextRequest, ctx: RouteContext<'/api/experiences/[slug]'>) {
    const {slug} = await ctx.params
    const client = await clientPromise;
    const db = client.db("hl-universe");
    const experience = await db.collection("experiences").findOne({slug: slug});

    return Response.json(experience)
}
