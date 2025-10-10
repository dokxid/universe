import { NextRequest, NextResponse } from "next/server";

// sometimes browser forces a request to /favicon.ico even tho its defined differently in the layout
// this is a workaround to redirect to the correct location
export function GET(request: NextRequest) {
    const url = request.nextUrl.clone();
    url.pathname = "/img/favicon.ico";
    return NextResponse.redirect(url, 307);
}
