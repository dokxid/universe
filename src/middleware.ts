import { authkitMiddleware } from "@workos-inc/authkit-nextjs";
import { NextResponse } from "next/server";

const CSP_ENABLED = false

export default async function middleware(req: any, event: any) {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

    let response = await authkitMiddleware({
        middlewareAuth: {
            enabled: true,
            unauthenticatedPaths: ["/", "/test"],
        },
    })(req, event);

    // Ensure response is not null or undefined
    if (!response) {
        response = NextResponse.next(); // Fallback to a default response
    }

    const cspHeader = `
    default-src 'self';
    script-src 'self' https://auth.workos.com 'nonce-${nonce}' 'strict-dynamic';
    connect-src 'self' https://auth.workos.com https://*.tiles.mapbox.com https://tiles.stadiamaps.com https://api.mapbox.com https://events.mapbox.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' https://auth.workos.com blob: data:;
    font-src 'self';
    object-src 'none';
    child-src blob:;
    worker-src blob:;
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    `;

    // Replace newline characters and spaces
    const contentSecurityPolicyHeaderValue = cspHeader
        .replace(/\s{2,}/g, " ")
        .trim();

    if (!CSP_ENABLED) {
        return response
    }

    response.headers.set("x-nonce", nonce);
    response.headers.set(
        "Content-Security-Policy",
        contentSecurityPolicyHeaderValue
    );
    return response;
}

// Match against pages that require authentication
export const config = {
    matcher: ["/", "/account/:page*", "/images/:page*", "/lab/:page*", "/test", "/addstory"],
};
