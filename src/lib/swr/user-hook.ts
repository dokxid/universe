import {
    getCurrentUserAction,
    getUserAction,
    getUserPermissionAction,
} from "@/actions/get-user";
import { Permissions } from "@/data/auth";
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

export function useUser(userId: string) {
    const { data, error, isLoading } = useSWR(["users", userId], () =>
        userFetcher(userId)
    );
    return {
        user: data,
        isLoading,
        isError: error,
    };
}

export function useUserFromWorkOSId() {
    const { data, error, isLoading } = useSWR(["user"], () =>
        getCurrentUserFetcher()
    );
    return {
        user: data,
        isLoading,
        isError: error,
    };
}

export function useAllowedToAddStory(labSlug: string) {
    const { data, error, isLoading } = useSWR(["user", labSlug], () =>
        userPermissionFetcher(labSlug, "add_story")
    );
    return {
        allowedToAddStory: data,
        isLoading,
        isError: error,
    };
}

export function useAllowedToEditStory(labSlug: string, storyId: string) {
    const { data, error, isLoading } = useSWR(["user", labSlug, storyId], () =>
        userPermissionFetcher(labSlug, "edit_story", storyId)
    );
    return {
        allowedToEditStory: data,
        isLoading,
        isError: error,
    };
}

export function useAllowedToManageUsers(labSlug: string) {
    const { data, error, isLoading } = useSWR(["user", labSlug], () =>
        userPermissionFetcher(labSlug, "manage_users")
    );
    return {
        allowedToManageUsers: data,
        isLoading,
        isError: error,
    };
}

export function useAllowedToSuperAdmin(labSlug: string) {
    const { data, error, isLoading } = useSWR(["user", labSlug], () =>
        userPermissionFetcher(labSlug, "superadmin")
    );
    return {
        allowedToSuperAdmin: data,
        isLoading,
        isError: error,
    };
}
