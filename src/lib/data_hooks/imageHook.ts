import useSWR from "swr";
import {fetcher} from "@/lib/data_hooks/fetcher";
import {ImageData} from "@/types/api";


export function useImageURL(experience: string, fileName: string) {
    const {data, error, isLoading} = useSWR(
        `/api/images/${experience}/${fileName}`,
        fetcher
    );
    return {
        imageUrl: data as ImageData,
        isLoading,
        isError: error
    }
}
