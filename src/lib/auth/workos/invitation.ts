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
