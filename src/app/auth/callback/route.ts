import { handleAuth } from "@workos-inc/authkit-nextjs";
import { NextRequest } from "next/server";

export const GET = generateAuthCallback();

function generateAuthCallback() {
    return async (req: NextRequest) => {
        const state = req.nextUrl.searchParams.get("state") || "/";
        const handler = handleAuth({ returnPathname: `${state}` });
        const res = await handler(req);

        return res;
    };
}
