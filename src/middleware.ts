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
const UNAUTHENTICATED_SLUG_PATHS = [
    "",
    "/map",
    "/stories",
    "/stories/view/:id",
    "/labs",
    "/map-settings",
    "/images/:filename",
    "/about",
    "/contact",
    "/login",
    "/user/view/:userId",
];
const UNAUTHENTICATED_SLUGLESS_PATHS = ["/api/files/:key"];
const SANITIZED_UNAUTHENTICATED_PATHS = UNAUTHENTICATED_SLUG_PATHS.map(
    (path) => SLUG_PATH_PREFIX + path
).concat(UNAUTHENTICATED_SLUGLESS_PATHS);

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
        // public paths
        "/:slug/",
        "/:slug/images/:filename",
        "/:slug/labs",
        "/:slug/map",
        "/:slug/map/:page*",
        "/:slug/map-settings",
        "/:slug/about",
        "/:slug/contact",
        "/:slug/stories",
        "/:slug/stories/view/:id",
        "/:slug/login",
        "/:slug/user/view/:userId",
        "/api/files/:key",
        // account and related paths
        "/:slug/account/user-preferences",
        // editor+ paths
        "/:slug/stories/create",
        "/:slug/stories/manage",
        "/:slug/stories/dashboard",
        "/:slug/stories/edit/:id",
        "/:slug/elevation-requests",
        // admin paths
        "/:slug/lab/settings",
        "/:slug/lab/manage",
        // super admin paths
        "/:slug/debug-settings",
        "/universe/labs/manage",
        "/universe/labs/view/:id",
        // static pages
        "/:slug/legal/privacy",
        "/:slug/legal/terms",
        "/:slug/legal/security",
    ],
};
