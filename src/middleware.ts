import { authkitMiddleware } from "@workos-inc/authkit-nextjs";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

const CSP_ENABLED = false;

// determine origin based on environment
const REDIRECT_ORIGIN =
    process.env.VERCEL_ENV === "production"
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : process.env.VERCEL_ENV === "preview"
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";

// build redirect URI if no environment variable is set
const CALLBACK_REDIRECT_PATHNAME = "/auth/callback";
const REDIRECT_URI = process.env.WORKOS_REDIRECT_URL
    ? new URL(process.env.WORKOS_REDIRECT_URL)
    : new URL(CALLBACK_REDIRECT_PATHNAME, REDIRECT_ORIGIN);

// prefix for labs (to avoid subdomain routing complexity)
const SLUG_PATH_PREFIX = "/:slug";
const UNAUTHENTICATED_PATHS = [
    "",
    "/map",
    "/stories",
    "/stories/view/:id",
    "/experiences",
    "/settings",
    "/images/:filename",
    "/about",
];
const SANITIZED_UNAUTHENTICATED_PATHS = UNAUTHENTICATED_PATHS.map(
    (path) => SLUG_PATH_PREFIX + path
);

function addCSPHeaders(response: Response): Response {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
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

    // replace newline characters and spaces
    const contentSecurityPolicyHeaderValue = cspHeader
        .replace(/\s{2,}/g, " ")
        .trim();

    // set CSP headers and x-nonce header
    response.headers.set("x-nonce", nonce);
    response.headers.set(
        "Content-Security-Policy",
        contentSecurityPolicyHeaderValue
    );
    return response;
}

export default async function middleware(
    req: NextRequest,
    event: NextFetchEvent
) {
    // apply authkit middleware
    let response = await authkitMiddleware({
        redirectUri: REDIRECT_URI.href,
        middlewareAuth: {
            enabled: true,
            unauthenticatedPaths: SANITIZED_UNAUTHENTICATED_PATHS,
        },
        debug: process.env.NODE_ENV !== "production",
    })(req, event);

    // ensure response is not null or undefined
    if (!response) {
        response = NextResponse.next(); // Fallback to a default response
    }

    // add CSP if needed
    if (CSP_ENABLED) {
        return addCSPHeaders(response);
    }

    return response;
}

// Match against pages that require authentication
export const config = {
    matcher: [
        "/:slug/",
        "/:slug/images/:filename",
        "/:slug/map",
        "/:slug/map/:page*",
        "/:slug/experiences",
        "/:slug/settings",
        "/:slug/account/:page*",
        "/:slug/lab/:page*",
        "/:slug/stories",
        "/:slug/stories/create",
        "/:slug/stories/manage",
        "/:slug/stories/dashboard",
        "/:slug/stories/edit/:id",
        "/:slug/stories/view/:id",
        "/:slug/team/:page*",
        "/:slug/stories",
        "/:slug/user-preferences",
        "/:slug/stories/elevation-requests",
        "/:slug/about",
        "/:slug/debug-settings",
        "/universe/elevation-requests",
    ],
};
