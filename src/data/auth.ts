import "server-only";

import { workos } from "@/lib/auth";
import dbConnect from "@/lib/mongodb/connections";
import { Experience } from "@/types/api";
import { UserRole } from "@/types/user";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { OrganizationMembership, User } from "@workos-inc/node";
import { cache } from "react";
import { getExperienceDTO } from "./dto/experience-dto";

export const getCurrentUser = cache(async () => {
    const { user } = await withAuth({ ensureSignedIn: true });
    return user;
});

export const getCurrentUserOptional = cache(async () => {
    const { user } = await withAuth({ ensureSignedIn: false });
    return user;
});

export async function isUserActive(
    viewer: User,
    experienceSlug: string
): Promise<boolean> {
    try {
        const userRelation = await getUserExperienceRelation(
            viewer,
            experienceSlug
        );
        return userRelation.status === "active";
    } catch {
        return false;
    }
}

export async function isUserMember(
    viewer: User,
    experienceSlug: string
): Promise<boolean> {
    try {
        const userRelation = await getUserExperienceRelation(
            viewer,
            experienceSlug
        );
        return (
            userRelation.role.slug === UserRole.MEMBER ||
            userRelation.role.slug === UserRole.ADMIN
        );
    } catch {
        return false;
    }
}

export async function isUserAdmin(
    viewer: User,
    experienceSlug: string
): Promise<boolean> {
    try {
        const userRelation = await getUserExperienceRelation(
            viewer,
            experienceSlug
        );
        return userRelation.role.slug == UserRole.ADMIN;
    } catch {
        return false;
    }
}

export function isUserSuperAdmin(viewer: User): boolean {
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

async function getUserExperienceRelation(
    viewer: User,
    experienceSlug: string
): Promise<OrganizationMembership> {
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
    if (membershipToReturn === undefined) {
        throw new Error(
            `No membership found for user ${viewer.id} in organization ${organizationId}`
        );
    }
    return membershipToReturn;
}
