import {
    getCurrentUserAction,
    getUserAction,
    getUserPermissionAction,
    getUserRoleAction,
} from "@/actions/get-user";
import { Permissions, Role } from "@/data/auth";
import useSWR from "swr";

const userFetcher = async (slug: string) => {
    return await getUserAction(slug);
};

const getCurrentUserFetcher = async () => {
    return await getCurrentUserAction();
};

const userPermissionFetcher = async (
    labSlug: string,
    permission: Permissions,
    storyId?: string
) => {
    return await getUserPermissionAction(labSlug, permission, storyId);
};

const userRoleFetcher = async (labSlug: string): Promise<Role> => {
    const role = await getUserRoleAction(labSlug);
    return role;
};

export function useUser(userId: string) {
    const { data, error, isLoading } = useSWR(["user", userId], () =>
        userFetcher(userId)
    );
    return {
        user: data,
        isLoading,
        isError: error,
    };
}

export function useCurrentUser() {
    const { data, error, isLoading } = useSWR("currentUser", () =>
        getCurrentUserFetcher()
    );
    return {
        user: data,
        isLoading,
        isError: error,
    };
}

export function useAllowedToAddStory(labSlug: string) {
    const { data, error, isLoading } = useSWR(
        ["userCanAddStory", labSlug],
        () => userPermissionFetcher(labSlug, "add_story")
    );
    return {
        allowedToAddStory: data,
        isLoading,
        isError: error,
    };
}

export function useAllowedToEditStory(labSlug: string, storyId: string) {
    const { data, error, isLoading } = useSWR(
        ["userCanEditStory", labSlug, storyId],
        () => userPermissionFetcher(labSlug, "edit_story", storyId)
    );
    return {
        allowedToEditStory: data,
        isLoading,
        isError: error,
    };
}

export function useAllowedToManageUsers(labSlug: string) {
    const { data, error, isLoading } = useSWR(
        ["userCanManageUsers", labSlug],
        () => userPermissionFetcher(labSlug, "manage_users")
    );
    return {
        allowedToManageUsers: data,
        isLoading,
        isError: error,
    };
}

export function useAllowedToSuperAdmin(labSlug: string) {
    const { data, error, isLoading } = useSWR(
        ["userIsSuperAdmin", labSlug],
        () => userPermissionFetcher(labSlug, "superadmin")
    );
    return {
        allowedToSuperAdmin: data,
        isLoading,
        isError: error,
    };
}

export function useGetRoleInLab(labSlug: string) {
    const { data, error, isLoading } = useSWR(
        ["userRoles", labSlug],
        async () => {
            const role = await userRoleFetcher(labSlug);
            return role;
        }
    );
    return {
        roleInLab: data,
        isLoading,
        isError: error,
    };
}
