import { getAllLabStoriesAction, getAllPublicStoriesAction, getStoryAction } from "@/actions/get-story";
import useSWR from "swr";

const storyFetcher = async (storyId: string) => {
    return await getStoryAction(storyId);
};
const labStoriesFetcher = async (slug: string) => {
    return await getAllLabStoriesAction(slug);
};
const allStoriesFetcher = async () => {
    return await getAllPublicStoriesAction()
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

export function useLabPublicStories(slug: string) {
    const { data, error, isLoading } = useSWR("stories", () =>
        labStoriesFetcher(slug),
    );
    return {
        stories: data,
        isLoading,
        isError: error,
    };
}

export function useAllPublicStories() {
    const { data, error, isLoading } = useSWR("stories", () =>
        allStoriesFetcher(),
    );
    return {
        stories: data,
        isLoading,
        isError: error,
    };
}
