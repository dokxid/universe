import { getExperiencesAction } from "@/actions/get-experience";
import useSWR from "swr";

const experienceFetcher = async () => {
    return await getExperiencesAction();
};

export function useExperiences() {
    const { data, error, isLoading } = useSWR("experiences", experienceFetcher);
    return {
        experiences: data,
        isLoading,
        isError: error,
    };
}
