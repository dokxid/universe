import {fetcher} from "@/lib/data_hooks/fetcher";
import useSWR from "swr";
import {StoryData} from "@/types/api";

export function useStories() {
    const {data, error, isLoading} = useSWR(`/api/stories`, fetcher)
    return {
        stories: data as StoryData[],
        isLoading,
        isError: error
    }
}

export function useStory(slug: string) {
    const {data, error, isLoading} = useSWR(`/api/stories/${slug}`, fetcher)
    return {
        story: data as StoryData,
        isLoading,
        isError: error,
    }
}
