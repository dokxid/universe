"use client";

import { getTagByNameAction, getTagsAction } from "@/actions/get-tag";
import { TagDTO } from "@/types/dtos";
import useSWR from "swr";

const tagByNameFetcher = async (tagName: string): Promise<TagDTO | null> => {
    return await getTagByNameAction(tagName);
};
const tagsFetcher = async (): Promise<TagDTO[] | null> => {
    return await getTagsAction();
};

export function useTags() {
    const { data, error, isLoading } = useSWR("all-tags", () => tagsFetcher());
    return {
        tags: data,
        isLoading,
        isError: error,
    };
}

export function useTag(name: string) {
    const { data, error, isLoading } = useSWR(["tag", name], async () =>
        tagByNameFetcher(name)
    );
    return {
        tag: data,
        isLoading,
        isError: error,
    };
}
