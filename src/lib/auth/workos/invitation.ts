import { getOrganizationFromSlugDTO } from "@/data/dto/getters/get-experience-dto";
import { WorkOS } from "@workos-inc/node";

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

export async function sendInvitation(email: string, slug: string) {
    const { organizationId } = await getOrganizationFromSlugDTO(slug);
    if (!organizationId) throw new Error("Organization not found");

    await workos.userManagement.sendInvitation({
        email,
        organizationId: organizationId,
        roleSlug: "member",
    });
}

export async function inviteLabAdmin(email: string, slug: string) {
    try {
        console.log(`Inviting lab admin ${email} to lab ${slug}`);
        throw new Error("Not implemented yet");
    } catch (error) {
        throw new Error(
            `Failed to invite lab admin: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}

export async function createOrganization(slug: string): Promise<string> {
    try {
        console.log(`Creating organization for lab ${slug}`);
        throw new Error("Not implemented yet");
    } catch (error) {
        throw new Error(
            `Failed to create organization: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}
