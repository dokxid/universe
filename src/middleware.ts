import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth/betterauth/auth";
import { headers } from "next/headers";
import { getLabSlugFromPathname } from "./lib/utils/pathname";

const CSP_ENABLED = false;
const DEBUG = false;

const GUEST_PATHS = [
    "/:slug/",
    "/:slug/map",
    "/:slug/stories",
    "/:slug/stories/view/:id",
    "/:slug/labs",
    "/:slug/map-settings",
    "/:slug/images/:filename",
    "/:slug/about",
    "/:slug/contact",
    "/:slug/login",
    "/:slug/user/view/:userId",
    "/:slug/signup",
    "/:slug/reset-password",
    "/api/files/:key",
    "/auth/accept-invitation/:invitationId",
    "/:slug/legal/imprint",
    "/:slug/legal/privacy",
    "/api/auth/reset-password/:token",
    "/:slug/help/how-to-start-a-heritage-lab"
];

function addCSPHeaders(response: NextResponse): NextResponse {
    if (CSP_ENABLED === false) {
        return response;
    }
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    connect-src 'self' https://*.tiles.mapbox.com https://tiles.stadiamaps.com https://api.mapbox.com https://events.mapbox.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
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
        contentSecurityPolicyHeaderValue,
    );
    return response;
}

function isGuestPath(pathname: string): boolean {
    const isGuestPath = GUEST_PATHS.some((path) => {
        const pattern = path.replace(/:[^/]+/g, "[^/]+");
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(pathname);
    });
    return isGuestPath;
}

export default async function middleware(req: NextRequest) {
    const slug = getLabSlugFromPathname(req.nextUrl.pathname);
    const response = NextResponse.next();

    if (DEBUG && req.method === "GET") {
        const debugObject = {
            pathname: req.nextUrl.pathname,
            isGuestPath: isGuestPath(req.nextUrl.pathname),
            slug: slug,
        };
        console.debug("Middleware debug:", JSON.stringify(debugObject));
    }

    // case: guest path, allow response
    if (isGuestPath(req.nextUrl.pathname)) {
        return addCSPHeaders(response);
    }

    // get session to verify authentication
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // case: no session / user, redirect to login
    if (!session || !session.user) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = `/${slug}/login`;
        return NextResponse.redirect(redirectUrl);
    }

    return addCSPHeaders(response);
}

// Match against pages that require authentication
export const config = {
    runtime: "nodejs",
    matcher: [
        // public apis
        "/api/files/:key",
        "/api/auth/reset-password/:token",

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
        "/:slug/signup",
        "/:slug/user/view/:userId",
        "/auth/accept-invitation/:invitationId",
        "/:slug/legal/imprint",
        "/:slug/legal/privacy",

        // account and related paths
        "/:slug/account/user-preferences",
        "/:slug/reset-password",

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
        "/universe/labs/create",

        // static pages
        "/:slug/legal/privacy",
        "/:slug/legal/terms",
        "/:slug/legal/security",
    ],
};
