import {
    ContentLayout,
    ContentLayoutInner,
} from "@/app/components/layout/content-layout";
import { AcceptInvitationView } from "@/app/components/views/accept-invitation-view";
import { getInvitationDTO } from "@/data/dto/getters/get-invitation-dto";

export default async function AcceptInvitationPage({
    params,
}: {
    params: Promise<{ invitationId: string }>;
}) {
    const { invitationId } = await params;
    const invitation = await getInvitationDTO(invitationId);
    return (
        <ContentLayout>
            <ContentLayoutInner className="flex flex-col items-center h-full justify-center">
                <AcceptInvitationView invitation={invitation} />
            </ContentLayoutInner>
        </ContentLayout>
    );
}
