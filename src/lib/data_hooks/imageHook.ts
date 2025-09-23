import { fetcher } from "@/lib/data_hooks/fetcher";
import { ImageURL } from "@/types/api";
import useSWR from "swr";

export function useImageURL(experience: string, fileName: string) {
    const { data, error, isLoading } = useSWR(
        `/api/images/${experience}/${fileName}`,
        fetcher
    );
    return {
        imageUrl: data as ImageURL,
        isLoading,
        isError: error,
    };
}
