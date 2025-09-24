import { getExperienceSignInDTO } from "@/data/dto/experience-dto";
import { getRedirectUri, workos } from "@/lib/auth";
import { ExperienceSignInDTO } from "@/types/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    const headersList = await headers();
    const refererHeader = headersList.get("referer");
    const redirectUri = getRedirectUri();

    let originatingUrl = "/";

    if (refererHeader) {
        try {
            const refererUrl = new URL(refererHeader);
            originatingUrl = refererUrl.pathname + refererUrl.search;
        } catch (error) {
            console.error("Invalid referer URL:", error);
        }
    }

    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get("lab");

    if (!slug) {
        return new Response("Missing lab parameter", { status: 400 });
    }

    const experienceSignIn = (await getExperienceSignInDTO(
        slug
    )) as ExperienceSignInDTO;

    if (!experienceSignIn.organization_id) {
        return new Response(
            `Organization ID not found: ${slug}, please contact the site administrator.`,
            { status: 400 }
        );
    }

    // for some reason i need to base64 encode the redirect url otherwise it fails
    const stateObject = {
        returnPathname: originatingUrl,
    };
    const jsonString = JSON.stringify(stateObject);
    const encodedState = btoa(jsonString);

    const authorizationUrl = workos.userManagement.getAuthorizationUrl({
        provider: "authkit",
        screenHint: "sign-in",
        redirectUri: redirectUri,
        organizationId: experienceSignIn.organization_id,
        clientId: process.env.WORKOS_CLIENT_ID!,
        state: encodedState,
    });

    return redirect(authorizationUrl);
};
