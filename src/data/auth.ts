import "server-only";

import { workos } from "@/lib/auth";
import dbConnect from "@/lib/mongodb/connections";
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
    viewer: User | null,
    experienceSlug: string
): Promise<boolean> {
    try {
        if (!viewer) return false;
        if (experienceSlug === "universe") return false;
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
    viewer: User | null,
    experienceSlug: string
): Promise<boolean> {
    try {
        if (!viewer) return false;
        if (experienceSlug === "universe") return false;
        const userRelation = await getUserExperienceRelation(
            viewer,
            experienceSlug
        );
        return userRelation.role.slug == UserRole.ADMIN;
    } catch {
        return false;
    }
}

export async function isUserSuperAdmin(
    user: User | null,
    experienceSlug: string
): Promise<boolean> {
    try {
        if (!user) return false;
        const userRelation = await getUserExperienceRelation(
            user,
            experienceSlug
        );
        return userRelation.role.slug === UserRole.SUPERADMIN;
    } catch {
        return false;
    }
}

export async function isUserPartOfOrganization(
    user: User | null,
    experienceSlug: string
) {
    if (!user) return false;
    const isActive = await isUserActive(user, experienceSlug);
    const isMember = await isUserMember(user, experienceSlug);
    return isActive && isMember;
}

async function getUserExperienceRelation(
    user: User | null,
    experienceSlug: string
): Promise<OrganizationMembership> {
    try {
        if (!user) throw new Error("User is not authenticated");
        dbConnect();
        const experience = await getExperienceDTO(experienceSlug);
        const organizationId = experience.organization_id;
        const membership =
            await workos.userManagement.listOrganizationMemberships({
                userId: user.id,
                organizationId: organizationId,
            });
        const membershipToReturn = membership.data.pop();
        if (membershipToReturn === undefined) {
            throw new Error(
                `No membership found for user ${user.id} in organization ${organizationId}`
            );
        }
        return membershipToReturn;
    } catch (err) {
        console.error("Error fetching user experience relation:", err);
        throw err;
    }
}
