import { getOrganizationFromSlugDTO } from "@/data/dto/getters/get-experience-dto";
import { OrganizationMembership, WorkOS } from "@workos-inc/node";

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

export async function sendInvitation(email: string, slug: string) {
    const { organizationId } = await getOrganizationFromSlugDTO(slug);
    if (!organizationId) throw new Error("Organization not found");

    const invitation = await workos.userManagement.sendInvitation({
        email,
        organizationId: organizationId,
        roleSlug: "member",
    });
    return invitation;
}

export async function inviteLabAdmin(
    organizationId: string,
    adminEmail: string
) {
    try {
        console.log(
            `Inviting lab admin ${adminEmail} to organization ${organizationId}`
        );
        const invitation = await workos.userManagement.sendInvitation({
            email: adminEmail,
            organizationId: organizationId,
            roleSlug: "admin",
        });
        if (!invitation || !invitation.id) {
            throw new Error("Failed to invite lab admin");
        }
        console.log(
            `Successfully invited lab admin ${adminEmail} to organization ${organizationId}`
        );
    } catch (error) {
        throw new Error(
            `Failed to invite lab admin: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}

export async function createOrganization(slug: string, adminEmail: string) {
    try {
        const organization = await workos.organizations.createOrganization({
            name: slug,
        });
        await inviteLabAdmin(organization.id, adminEmail);
        return organization;
    } catch (error) {
        throw new Error(
            `Failed to create organization: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}

export async function getOrganizationMembership(
    organizationId: string,
    userId: string
): Promise<OrganizationMembership> {
    try {
        const membership =
            await workos.userManagement.listOrganizationMemberships({
                organizationId,
                userId,
            });
        if (!membership.data.length) {
            throw new Error("No membership found");
        }
        return membership.data[0];
    } catch (error) {
        throw new Error(
            `Failed to get organization membership: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}

export async function updateOrganizationMembership(
    organizationId: string,
    userId: string,
    role: string
) {
    try {
        const membership = await getOrganizationMembership(
            organizationId,
            userId
        );
        const updatedMembership =
            await workos.userManagement.updateOrganizationMembership(
                membership.id,
                {
                    roleSlug: role,
                }
            );
        if (updatedMembership.role.slug !== role) {
            throw new Error("Failed to update membership role");
        }
        return updatedMembership;
    } catch (error) {
        throw new Error(
            `Failed to update organization membership: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}
