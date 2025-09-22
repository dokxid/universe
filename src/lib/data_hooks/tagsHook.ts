import { fetcher } from "@/lib/data_hooks/fetcher";
import useSWR from "swr";
import { Tag } from "@/types/api";

export function useTags() {
    const {data, error, isLoading} = useSWR(`/api/tags`, fetcher)
    return {
        tags: data as Tag[],
        isLoading,
        isError: error
    }
}
