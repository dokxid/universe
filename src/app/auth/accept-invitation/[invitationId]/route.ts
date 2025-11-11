import { getInvitationDTO } from "@/data/dto/getters/get-invitation-dto";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ invitationId: string }> },
) {
    try {
        const { invitationId } = await params;
        const invitation = await getInvitationDTO(invitationId);
        const slug = invitation.lab.slug;
        const returnUrl = new URL(`/${slug}/invitation/${invitationId}`, process.env.BETTER_AUTH_URL!);

        if (!slug) {
            return notFound();
        }

        // // case: user not logged in, redirect to login
        // const user = await getCurrentUser(false);
        // console.log("Current user:", user);
        // if (!user) {
        //     const redirectUrl = req.nextUrl.clone();
        //     redirectUrl.pathname = `/${slug}/login`;
        //     redirectUrl.searchParams.set(
        //         "next",
        //         returnUrl + req.nextUrl.search,
        //     );
        //     return NextResponse.redirect(redirectUrl);
        // }
        return NextResponse.redirect(returnUrl);
    } catch (error) {
        console.log("Error accepting invitation:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error : "Unknown error" },
            { status: 500 },
        );
    }
}
