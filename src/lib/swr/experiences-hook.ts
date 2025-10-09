import {
    getExperienceAction,
    getExperiencesAction,
} from "@/actions/get-experience";
import useSWR from "swr";

const experiencesFetcher = async () => {
    return await getExperiencesAction();
};

const experienceFetcher = async (slug: string) => {
    return await getExperienceAction(slug);
};

export function useExperiences() {
    const { data, error, isLoading } = useSWR(
        "experiences",
        experiencesFetcher
    );
    return {
        experiences: data,
        isLoading,
        isError: error,
    };
}

export function useExperience(slug: string) {
    const { data, error, isLoading } = useSWR(["experiences", slug], () =>
        experienceFetcher(slug)
    );
    return {
        experience: data,
        isLoading,
        isError: error,
    };
}
