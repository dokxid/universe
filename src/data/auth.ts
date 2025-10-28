import "server-only";

import { Role as UserRole } from "@/generated/prisma/enums";
import { withAuth } from "@/lib/auth/betterauth/session";
import { UserDTO } from "@/types/dtos";
import { cache } from "react";
import { canUserEditStoryId } from "./dto/auth/story-permissions";

type MembershipResult = {
    isMember: boolean;
    isAdmin: boolean;
    error?: string;
};

export type Permissions =
    | "add_story"
    | "edit_story"
    | "superadmin"
    | "manage_users";

export type Role =
    | "admin"
    | "editor"
    | "superadmin"
    | "not_authorized"
    | "guest";

export const getPermissionsByUser = cache(
    async (
        user: UserDTO | null,
        experienceSlug: string,
        storyId?: string,
    ): Promise<Permissions[]> => {
        const permissions: Permissions[] = [];

        // case when user not logged in, no permissions
        if (!user) return permissions;

        if (await isUserSuperAdmin()) {
            permissions.push(
                "superadmin",
                "manage_users",
                "add_story",
                "edit_story",
            );
            return permissions;
        } else if (await isUserAdmin(experienceSlug)) {
            permissions.push("manage_users", "add_story", "edit_story");
        } else if (await isUserMember(user, experienceSlug)) {
            if (storyId) {
                if (await canUserEditStoryId(storyId)) {
                    permissions.push("edit_story");
                }
            }
            permissions.push("add_story");
        }
        console.log(
            `User ${user.id} permissions in ${experienceSlug}:`,
            permissions,
        );
        return permissions;
    },
);

export const getCurrentUser = cache(async () => {
    try {
        const user = await withAuth({ ensureSignedIn: true });
        if (!user) throw new Error("User is not authenticated");
        return user;
    } catch (err) {
        throw err;
    }
});

export const getCurrentUserOptional = cache(async () => {
    try {
        const user = await withAuth({ ensureSignedIn: false });
        return user;
    } catch {
        return null;
    }
});

export async function isUserMember(
    viewer: UserDTO,
    experienceSlug: string,
): Promise<boolean> {
    try {
        if (!viewer) return false;
        if (await isUserSuperAdmin()) return true;
        if (experienceSlug === "universe") return false;
        const userRelation = await getUserLabRelationBySlug(
            viewer,
            experienceSlug,
        );
        return userRelation.isMember;
    } catch {
        return false;
    }
}

export async function isUserAdmin(experienceSlug: string): Promise<boolean> {
    try {
        const viewer = await getCurrentUserOptional();
        if (!viewer) return false;
        if (experienceSlug === "universe") return false;
        const userRelation = await getUserLabRelationBySlug(
            viewer,
            experienceSlug,
        );
        return userRelation.isAdmin;
    } catch {
        return false;
    }
}

export async function isUserSuperAdmin(): Promise<boolean> {
    try {
        const user = await getCurrentUserOptional();
        if (!user) return false;
        if (!user.superAdmin) return false;
        return true;
    } catch (err) {
        console.error("Error fetching user experience relation:", err);
        throw err;
    }
}

export async function isUserPartOfOrganization(
    user: UserDTO | null,
    experienceSlug: string,
) {
    try {
        if (!user) return false;
        const isMember = await isUserMember(user, experienceSlug);
        return isMember;
    } catch {
        return false;
    }
}

async function getUserLabRelationBySlug(
    user: UserDTO | null,
    labSlug: string,
): Promise<MembershipResult> {
    try {
        if (!user) throw new Error("User is not authenticated");
        const role = user.labs.find((lab) => lab.slug === labSlug)?.role;
        if (!role) {
            return {
                isMember: false,
                isAdmin: false,
                error: "No membership found",
            };
        }
        return {
            isMember: role === UserRole.member || role === UserRole.admin,
            isAdmin: role === UserRole.admin,
        };
    } catch (err) {
        console.error("Error fetching user experience relation:", err);
        throw err;
    }
}
