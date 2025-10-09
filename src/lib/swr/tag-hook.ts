"use client";

import { getTagsAction, getTagsByNameAction } from "@/actions/get-tag";
import { UnescoTagDTO } from "@/types/dtos";
import useSWR from "swr";

const tagByNameFetcher = async (
    tagNames: string[]
): Promise<UnescoTagDTO[] | null> => {
    return await getTagsByNameAction(tagNames);
};
const tagsFetcher = async (): Promise<UnescoTagDTO[] | null> => {
    return await getTagsAction();
};

export function useTagsByName(tagNames: string[]) {
    const { data, error, isLoading } = useSWR(["tags", tagNames], () =>
        tagByNameFetcher(tagNames)
    );
    if (tagNames === null) {
        return {
            tags: null,
            isLoading: false,
            isError: true,
        };
    }
    return {
        tags: data,
        isLoading,
        isError: error,
    };
}

export function useTags() {
    const { data, error, isLoading } = useSWR("all-tags", () => tagsFetcher());
    return {
        tags: data,
        isLoading,
        isError: error,
    };
}
