import "server-only";

import { Role as UserRole } from "@/generated/prisma/enums";
import { getUserFromSession } from "@/lib/auth/betterauth/session";
import { UserDTO } from "@/types/dtos";
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

const PERMISSIONS_SUPERADMIN: Permissions[] = [
    "superadmin",
    "manage_users",
    "add_story",
    "edit_story",
];
const PERMISSIONS_ADMIN: Permissions[] = [
    "manage_users",
    "add_story",
    "edit_story",
];
const PERMISSIONS_AUTHOR: Permissions[] = ["edit_story"];
const PERMISSIONS_MEMBER: Permissions[] = ["add_story"];

/**
 * Gets the permissions for a user, depending on their role in the experience.
 * @param user - the current user
 * @param experienceSlug - the lab to check against (else admin would work for any lab)
 * @param storyId - the story to check edit permissions for (optional)
 * @returns the permissions the user has for the given experience and story
 */
export const getPermissionsByUser = async (
    user: UserDTO | null,
    experienceSlug: string,
    storyId?: string,
): Promise<Permissions[]> => {
    const permissions: Permissions[] = [];

    // case when user not logged in, no permissions
    if (!user) return permissions;

    if (await isUserSuperAdmin()) {
        // case user is superadmin: all permissions
        permissions.push(...PERMISSIONS_SUPERADMIN);
        return permissions;
    } else if (await isUserAdmin(experienceSlug)) {
        // case user is admin of experience: manage users, add and edit stories
        permissions.push(...PERMISSIONS_ADMIN);
        return permissions;
    } else if (await isUserMember(user, experienceSlug)) {
        // case user is member of experience: add story, edit story if storyId provided and user can edit it
        if (storyId && (await canUserEditStoryId(storyId)))
            permissions.push(...PERMISSIONS_AUTHOR);
        permissions.push(...PERMISSIONS_MEMBER);
    }

    // case when user is not member of experience: no permissions
    return permissions;
};

/**
 * Fetches the current authenticated user.
 * @param ensureSignedIn - If true, will throw an error if the user is not signed in.
 * @throws Error if ensureSignedIn is true and the user is not authenticated.
 * @returns The current user as a sanitized UserDTO or null.
 */
export const getCurrentUser = async (
    ensureSignedIn = true,
): Promise<UserDTO | null> => {
    try {
        const user = await getUserFromSession({
            ensureSignedIn: ensureSignedIn,
        });
        if (ensureSignedIn && !user)
            throw new Error("User is not authenticated");
        return user;
    } catch (err) {
        throw err;
    }
};

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
        const viewer = await getCurrentUser(false);
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
        const user = await getCurrentUser(false);
        return user?.superAdmin || false;
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
