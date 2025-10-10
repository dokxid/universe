import { getImageURLAction } from "@/actions/get-image-url";
import useSWR from "swr";

const imageURLFetcher = async ([experience, fileName]: [string, string]) => {
    return await getImageURLAction(experience, fileName);
};

export function useImageURL(experience: string, fileName: string) {
    const { data, error, isLoading } = useSWR(
        [experience, fileName],
        imageURLFetcher,
        {
            // Cache the result and revalidate infrequently
            revalidateOnFocus: false,      // Don't refetch when window regains focus
            revalidateOnReconnect: false,  // Don't refetch on reconnect
            revalidateIfStale: false,      // Don't refetch if cache is stale
            dedupingInterval: 60000,       // Dedupe requests within 60 seconds
            focusThrottleInterval: 60000,  // Throttle focus revalidation
            // Cache images for a long time (presigned URLs are temporary anyway)
            refreshInterval: 0,            // Don't auto-refresh
        }
    );
    return {
        imageUrl: data,
        isLoading,
        isError: error,
    };
}
