"use server";

import {
    getCurrentUser,
    getPermissionsByUser,
    Permissions,
    Role,
} from "@/data/auth";
import { getUserDTO } from "@/data/dto/getters/get-user-dto";
import { UserDTO } from "@/types/dtos";

export async function getUserAction(userId: string): Promise<UserDTO | null> {
    try {
        const user = await getUserDTO(userId);
        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Failed to fetch user data");
    }
}

export async function getCurrentUserAction(
    ensureLoggedIn = true,
): Promise<UserDTO | null> {
    try {
        const currentUser = await getCurrentUser(ensureLoggedIn);
        if (!currentUser) return null;
        const user = await getUserDTO(currentUser.id);
        return user;
    } catch (error) {
        console.error("Error fetching current user:", error);
        throw new Error("Failed to fetch current user data");
    }
}

export async function getUserFromIdAction(
    userId: string,
): Promise<UserDTO | null> {
    try {
        const user = await getUserDTO(userId);
        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Failed to fetch user data");
    }
}

export async function getUserPermissionAction(
    labSlug: string,
    permission: Permissions,
    storyId?: string,
): Promise<boolean> {
    try {
        const user = await getCurrentUser(false);
        const permissions = await getPermissionsByUser(user, labSlug, storyId);
        return permissions.includes(permission);
    } catch (error) {
        console.error("Error fetching user permissions:", error);
        throw new Error("Failed to fetch user permissions");
    }
}

export async function getUserRoleAction(labSlug: string): Promise<Role> {
    try {
        const user = await getCurrentUser(false);
        if (!user) return "guest";
        const permissions = await getPermissionsByUser(user, labSlug);
        if (permissions.includes("superadmin")) return "superadmin";
        if (permissions.includes("manage_users")) return "admin";
        if (permissions.includes("add_story")) return "editor";
        return "not_authorized";
    } catch (error) {
        console.error("Error fetching user roles:", error);
        throw new Error("Failed to fetch user roles");
    }
}
