import "server-only";

import { workos } from "@/lib/auth/workos/callback";
import dbConnect from "@/lib/data/mongodb/connections";
import { UserRole } from "@/types/user";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { User } from "@workos-inc/node";
import { cache } from "react";
import { getExperienceDTO } from "./dto/experience-dto";

type MembershipResult = {
    isMember: boolean;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    isActive: boolean;
    error?: string;
};

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
        return userRelation.isActive;
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
        return userRelation.isMember;
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
        return userRelation.isAdmin;
    } catch {
        return false;
    }
}

export async function isUserSuperAdmin(user: User | null): Promise<boolean> {
    try {
        if (!process.env.NEXT_PUBLIC_WORKOS_SUPER_ADMIN_ORG_ID) {
            throw new Error("WORKOS_SUPER_ADMIN_ORG_ID is not set");
        }
        if (!user) return false;
        const organizationId =
            process.env.NEXT_PUBLIC_WORKOS_SUPER_ADMIN_ORG_ID;
        const membership =
            await workos.userManagement.listOrganizationMemberships({
                userId: user.id,
                organizationId: organizationId,
            });
        const membershipToReturn = membership.data.pop();
        if (membershipToReturn === undefined) {
            return false;
        }
        return true;
    } catch (err) {
        console.error("Error fetching user experience relation:", err);
        throw err;
    }
}

export async function isUserPartOfOrganization(
    user: User | null,
    experienceSlug: string
) {
    try {
        if (!user) return false;
        const isActive = await isUserActive(user, experienceSlug);
        const isMember = await isUserMember(user, experienceSlug);
        return isActive && isMember;
    } catch {
        return false;
    }
}

async function getUserExperienceRelation(
    user: User | null,
    experienceSlug: string
): Promise<MembershipResult> {
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
            return {
                isMember: false,
                isAdmin: false,
                isSuperAdmin: false,
                isActive: false,
                error: "No membership found",
            };
        }
        return {
            isMember:
                membershipToReturn.role.slug === UserRole.MEMBER ||
                membershipToReturn.role.slug === UserRole.ADMIN,
            isAdmin: membershipToReturn.role.slug === UserRole.ADMIN,
            isSuperAdmin: membershipToReturn.role.slug === UserRole.SUPERADMIN,
            isActive: membershipToReturn.status === "active",
        };
    } catch (err) {
        console.error("Error fetching user experience relation:", err);
        throw err;
    }
}
