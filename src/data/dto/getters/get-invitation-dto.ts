import { fetchInvitation } from "@/data/fetcher/invitation-fetcher";
import { buildDisplayedName } from "@/data/transformers/user-transformer";
import { Role } from "@/generated/prisma/enums";
import { InvitationDTO } from "@/types/dtos";

export const getInvitationDTO = async (
    invitationId: string,
): Promise<InvitationDTO> => {
    try {
        const rawInvitation = await fetchInvitation(invitationId);
        if (!rawInvitation) {
            throw new Error("Invitation not found");
        }
        const sanitizedInvitation = {
            id: rawInvitation.id,
            inviter: {
                name: buildDisplayedName({
                    firstName: rawInvitation.user.firstName,
                    familyName: rawInvitation.user.familyName,
                    displayName: rawInvitation.user.displayName,
                }),
                id: rawInvitation.user.id,
            },
            email: rawInvitation.email,
            lab: {
                id: rawInvitation.lab.id,
                name: rawInvitation.lab.name,
                slug: rawInvitation.lab.slug,
                logo: rawInvitation.lab.logo,
            },
            role: (rawInvitation.role as Role) ?? Role.member,
        };
        return sanitizedInvitation;
    } catch (err) {
        console.error("Error getting story:", err);
        throw new Error(err instanceof Error ? err.message : "Unknown error");
    }
};
