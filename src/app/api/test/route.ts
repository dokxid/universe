import dbConnect from "@/lib/mongodb/connections";
import experiences from "@/types/models/experiences";

await dbConnect();
const exp = await experiences.find({}).lean();

export async function GET() {
    return new Response(JSON.stringify(exp), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
