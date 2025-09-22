import { handleAuth } from "@workos-inc/authkit-nextjs";
import { NextRequest } from "next/server";

export const GET = generateAuthCallback();

function generateAuthCallback() {
    return (req: NextRequest) => {
        const state = req.nextUrl.searchParams.get("state") || "/";
        console.log("State:", state);
        return handleAuth({ returnPathname: `${state}` })(req);
    };
}
