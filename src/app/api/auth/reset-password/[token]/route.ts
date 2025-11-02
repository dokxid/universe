import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ token: string }> },
) {
    try {
        const { token } = await params;
        const returnUrl = req.nextUrl.clone();
        returnUrl.searchParams.set("token", token);
        returnUrl.pathname = `/universe/reset-password`;
        return NextResponse.redirect(returnUrl);
    } catch (error) {
        console.log("Error accepting invitation:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error : "Unknown error" },
            { status: 500 },
        );
    }
}
