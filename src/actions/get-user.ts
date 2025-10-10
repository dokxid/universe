"use server";

import {
    getCurrentUserOptional,
    getPermissionsByUser,
    Permissions,
    Role,
} from "@/data/auth";
import { getUserDTO, getUserFromWorkOSIdDTO } from "@/data/dto/user-dto";
import { UserDTO } from "@/lib/data/mongodb/models/user-model";

export async function getUserAction(userId: string): Promise<UserDTO | null> {
    try {
        const user = await getUserDTO(userId);
        return user;
    } catch (error) {
        console.error("Error fetching lab:", error);
        throw new Error("Failed to fetch lab data");
    }
}

export async function getCurrentUserAction(): Promise<UserDTO | null> {
    try {
        const userWorkOS = await getCurrentUserOptional();
        if (!userWorkOS) return null;
        const user = await getUserFromWorkOSIdDTO(userWorkOS.id);
        return user;
    } catch (error) {
        console.error("Error fetching lab:", error);
        throw new Error("Failed to fetch lab data");
    }
}

export async function getUserFromWorkOSIdAction(
    userId: string
): Promise<UserDTO | null> {
    try {
        const user = await getUserFromWorkOSIdDTO(userId);
        return user;
    } catch (error) {
        console.error("Error fetching lab:", error);
        throw new Error("Failed to fetch lab data");
    }
}

export async function getUserPermissionAction(
    labSlug: string,
    permission: Permissions,
    storyId?: string
): Promise<boolean> {
    try {
        const user = await getCurrentUserOptional();
        const permissions = await getPermissionsByUser(user, labSlug, storyId);
        return permissions.includes(permission);
    } catch (error) {
        console.error("Error fetching lab:", error);
        throw new Error("Failed to fetch lab data");
    }
}

export async function getUserRoleAction(labSlug: string): Promise<Role> {
    try {
        const user = await getCurrentUserOptional();
        if (!user) return "guest";
        const permissions = await getPermissionsByUser(user, labSlug);
        if (permissions.includes("superadmin")) return "superadmin";
        if (permissions.includes("manage_users")) return "admin";
        if (permissions.includes("add_story")) return "editor";
        return "not_authorized";
    } catch (error) {
        console.error("Error fetching lab:", error);
        throw new Error("Failed to fetch lab data");
    }
}
