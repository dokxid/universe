import { getRedirectUri, workos } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const GET = async () => {
    const headersList = await headers();
    const refererHeader = headersList.get("referer");
    const redirectUri = getRedirectUri();
    console.log("Redirect URI:", redirectUri);

    let originatingUrl = "/";

    if (refererHeader) {
        try {
            const refererUrl = new URL(refererHeader);
            originatingUrl = refererUrl.pathname + refererUrl.search;
        } catch (error) {
            console.error("Invalid referer URL:", error);
        }
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
        clientId: process.env.WORKOS_CLIENT_ID!,
        state: encodedState,
    });

    return redirect(authorizationUrl);
};
