import "server-only";

import { workos } from "@/lib/auth";
import dbConnect from "@/lib/mongodb/connections";
import { Experience } from "@/types/api";
import { UserRole } from "@/types/user";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { User } from "@workos-inc/node";
import { cache } from "react";
import { getExperienceDTO } from "./dto/experience-dto";

export const getCurrentUser = cache(async () => {
    const { user } = await withAuth({ ensureSignedIn: true });
    return user;
});

export async function isUserActive(
    viewer: User,
    experienceSlug: string
): Promise<boolean> {
    return await getUserExperienceRelation(viewer, experienceSlug)
        .then((relation) => {
            return relation.status == "active";
        })
        .catch((err) => {
            throw new Error(err);
        });
}

export async function isUserMember(
    viewer: User,
    experienceSlug: string
): Promise<boolean> {
    return await getUserExperienceRelation(viewer, experienceSlug)
        .then((relation) => {
            return (
                relation.role.slug == UserRole.MEMBER ||
                relation.role.slug == UserRole.ADMIN
            );
        })
        .catch((err) => {
            throw new Error(err);
        });
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

export function isSuperAdmin(viewer: User): boolean {
    return false;
}

export async function isUserPartOfOrganization(
    viewer: User,
    experienceSlug: string
) {
    const isActive = await isUserActive(viewer, experienceSlug);
    const isMember = await isUserMember(viewer, experienceSlug);
    return isActive && isMember;
}

async function getUserExperienceRelation(viewer: User, experienceSlug: string) {
    dbConnect();
    const experience = JSON.parse(
        await getExperienceDTO(experienceSlug)
    ) as Experience;
    const organizationId = experience.organization_id;
    const membership = await workos.userManagement.listOrganizationMemberships({
        userId: viewer.id,
        organizationId: organizationId,
    });
    const membershipToReturn = membership.data.pop();
    if (membershipToReturn === undefined)
        throw new Error("no membership found");
    return membershipToReturn;
}
