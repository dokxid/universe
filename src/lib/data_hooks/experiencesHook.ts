import {fetcher} from "@/lib/data_hooks/fetcher";
import useSWR from "swr";

export function useExperiences() {
    const {data, error, isLoading} = useSWR(`/api/experiences`, fetcher)
    return {
        experiences: data,
        isLoading,
        isError: error
    }
}

export function useExperience(slug: string) {
    const {data, error, isLoading} = useSWR(`/api/experiences/${slug}`, fetcher)
    return {
        experience: data,
        isLoading,
        isError: error,
    }
}