import { getStoryAction } from "@/actions/get-story";
import useSWR from "swr";

const storyFetcher = async (slug: string) => {
    return await getStoryAction(slug);
};

export function useStory(storyId: string) {
    const { data, error, isLoading } = useSWR(["story", storyId], () =>
        storyFetcher(storyId),
    );
    return {
        story: data,
        isLoading,
        isError: error,
    };
}
