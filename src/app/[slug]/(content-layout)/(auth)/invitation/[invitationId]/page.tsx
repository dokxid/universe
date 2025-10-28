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
                <div className="grid w-lg">
                    <div className="flex flex-col gap-4 p-6 md:p-10">
                        <div className="flex flex-1 items-center justify-center">
                            <div className="w-full max-w-xs">
                                <AcceptInvitationView invitation={invitation} />
                            </div>
                        </div>
                    </div>
                </div>
            </ContentLayoutInner>
        </ContentLayout>
    );
}
