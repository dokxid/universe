import {fetcher} from "@/lib/data_hooks/fetcher";
import useSWR from "swr";
import {TagData} from "@/types/api";

export function useTags() {
    const {data, error, isLoading} = useSWR(`/api/tags`, fetcher)
    return {
        tags: data as TagData[],
        isLoading,
        isError: error
    }
}
