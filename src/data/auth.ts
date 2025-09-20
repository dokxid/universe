import { withAuth } from "@workos-inc/authkit-nextjs";
import { cache } from "react";
import { UserRole } from "@/types/user";
import { User, WorkOS } from "@workos-inc/node";
import { connect } from "http2";
import dbConnect from "@/lib/mongodb/connections";
import { getExperienceDTO } from "./dto/story-dto";

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
    dbConnect();
    const experience = await getExperienceDTO(experienceSlug);
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
