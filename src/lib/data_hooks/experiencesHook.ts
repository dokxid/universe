import {fetcher} from "@/lib/data_hooks/fetcher";
import useSWR from "swr";
import {ExperienceData} from "@/types/api";

export function useExperiences() {
    const {data, error, isLoading} = useSWR(`/api/experiences`, fetcher)
    return {
        experiences: data as ExperienceData[],
        isLoading,
        isError: error
    }
}

export function useExperience(slug: string) {
    const {data, error, isLoading} = useSWR(`/api/experiences/${slug}`, fetcher)
    return {
        experience: data as ExperienceData,
        isLoading,
        isError: error,
    }
}