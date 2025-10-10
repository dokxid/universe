import { NextResponse } from "next/server";

// sometimes browser forces a request to /favicon.ico even tho its defined differently in the layout
// this is a workaround to redirect to the correct location
export function GET() {
    return NextResponse.redirect("/img/favicon.ico", 307);
}
