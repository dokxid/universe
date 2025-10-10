import { handleAuth } from "@workos-inc/authkit-nextjs";
import { NextRequest } from "next/server";

export const GET = generateAuthCallback();

function generateAuthCallback() {
    return async (req: NextRequest) => {
        const state = req.nextUrl.searchParams.get("state") || "/";
        const handler = handleAuth({ returnPathname: `${state}` });
        const res = await handler(req);

        // Debug: print headers so you can see Set-Cookie
        console.log(
            "[auth callback] response headers:",
            Array.from(res.headers.entries())
        );

        if (process.env.NODE_ENV !== "production") {
            const headers = new Headers(res.headers);
            const setCookie = headers.get("set-cookie");
            if (setCookie) {
                // Remove Domain attribute so cookie applies to current host (dev-only)
                const cleaned = setCookie.replace(/;\s*Domain=[^;]+/i, "");
                headers.set("set-cookie", cleaned);
                console.log(
                    "[auth callback] modified set-cookie for local dev:",
                    cleaned
                );
            }
            return new Response(res.body, { status: res.status, headers });
        }

        return res;
    };
}
