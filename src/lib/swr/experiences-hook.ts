import { getLabAction, getLabsAction } from "@/actions/get-experience";
import useSWR from "swr";

const labsFetcher = async () => {
    return await getLabsAction();
};

const labFetcher = async (slug: string) => {
    return await getLabAction(slug);
};

export function useLabs() {
    const { data, error, isLoading } = useSWR("labs", labsFetcher);
    return {
        labs: data,
        isLoading,
        isError: error,
    };
}

export function useLab(slug: string) {
    const { data, error, isLoading } = useSWR(["lab", slug], () =>
        labFetcher(slug),
    );
    return {
        lab: data,
        isLoading,
        isError: error,
    };
}
