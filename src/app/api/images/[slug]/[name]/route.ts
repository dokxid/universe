import { getSignedS3URL } from "@/lib/files/s3";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string; name: string }> }
): Promise<Response> {
    const { slug, name } = await params;
    let url: string;

    try {
        if (process.env.LOCAL_UPLOADER === "true") {
            url = new URL(`/uploads/${slug}/${name}`, request.url).toString();
            return NextResponse.json({ url });
        } else {
            url = await getSignedS3URL(slug, name);
        }
        return new NextResponse(JSON.stringify({ url }), {
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error fetching image:", error);
        return new NextResponse(
            JSON.stringify({ error: "Error fetching image" }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
}
