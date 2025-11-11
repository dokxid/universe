import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        revalidateTag("stories");
        revalidateTag("labs");
        revalidateTag("tags");
        return NextResponse.json({
            message: "Revalidation triggered for all tags",
        });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
