import { withAuth } from "@workos-inc/authkit-nextjs";
import { cache } from "react";
import { UserRole } from "@/types/user";
import { User, WorkOS } from "@workos-inc/node";
import { clientPromise } from "@/lib/mongodb/connections";

const workos = new WorkOS(process.env.WORKOS_API_KEY || "");

export const getCurrentUser = cache(async () => {
    const { user } = await withAuth({ ensureSignedIn: true });
    return user;
});

export async function isUserActive(
    viewer: User,
    experienceSlug: string
): Promise<boolean> {
    await getUserExperienceRelation(viewer, experienceSlug).then((relation) => {
        return relation.status == "active";
    });
    return false;
}

export async function isUserMember(
    viewer: User,
    experienceSlug: string
): Promise<boolean> {
    await getUserExperienceRelation(viewer, experienceSlug)
        .then((relation) => {
            return (
                relation.role.slug == UserRole.MEMBER ||
                relation.role.slug == UserRole.ADMIN
            );
        })
        .catch((err) => {
            throw new Error(err);
        });
    return false;
}

export async function isAdmin(
    viewer: User,
    experienceSlug: string
): Promise<boolean> {
    await getUserExperienceRelation(viewer, experienceSlug)
        .then((relation) => {
            return relation.role.slug == UserRole.ADMIN;
        })
        .catch((err) => {
            throw new Error(err);
        });
    return false;
}

async function getUserExperienceRelation(viewer: User, experienceSlug: string) {
    const client = await clientPromise;
    const db = client.db("hl-universe");
    const experience = await db
        .collection("experiences")
        .findOne({ slug: experienceSlug });
    if (!experience) throw new Error("experience not found");
    const organizationId = experience.organizationId;
    return await workos.userManagement
        .listOrganizationMemberships({
            userId: viewer.id,
            organizationId: organizationId,
        })
        .then((membership) => {
            const membershipToReturn = membership.data.pop();
            if (membershipToReturn === undefined)
                throw new Error("no membership found");
            return membershipToReturn;
        })
        .catch((err) => {
            throw new Error(err);
        });
}
