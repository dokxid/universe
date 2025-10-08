import { getUserAction, getUserFromWorkOSIdAction } from "@/actions/get-user";
import useSWR from "swr";

const userFetcher = async (slug: string) => {
    return await getUserAction(slug);
};

const userFromWorkOSIdFetcher = async (slug: string) => {
    return await getUserFromWorkOSIdAction(slug);
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

export function useUserFromWorkOSId(userId: string) {
    const { data, error, isLoading } = useSWR(["users", userId], () =>
        userFromWorkOSIdFetcher(userId)
    );
    return {
        user: data,
        isLoading,
        isError: error,
    };
}
