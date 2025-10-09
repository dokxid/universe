import { getImageURLAction } from "@/actions/get-image-url";
import useSWR from "swr";

const imageURLFetcher = async ([experience, fileName]: [string, string]) => {
    return await getImageURLAction(experience, fileName);
};

export function useImageURL(experience: string, fileName: string) {
    const { data, error, isLoading } = useSWR(
        [experience, fileName],
        imageURLFetcher
    );
    return {
        imageUrl: data,
        isLoading,
        isError: error,
    };
}
