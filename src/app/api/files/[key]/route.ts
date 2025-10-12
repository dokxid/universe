import { getSignedS3URL } from "@/lib/data/uploader/s3";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ key: string }> }
) {
    try {
        const { key } = await params;
        const isS3 = !key.startsWith("http");
        if (!isS3) {
            return NextResponse.json({ url: key });
        }
        const url = await getSignedS3URL(key);
        return NextResponse.redirect(url);
    } catch (error) {
        console.error("Error in GET /api/files/[key]:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
