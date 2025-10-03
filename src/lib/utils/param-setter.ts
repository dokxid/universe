export const setSelectedStoryIdParams = (
    pathname: string,
    searchParams: URLSearchParams,
    newSelectedStoryId: string
) => {
    const search = new URLSearchParams(searchParams);
    if (newSelectedStoryId !== "") {
        search.set("story", newSelectedStoryId);
    } else {
        search.delete("story");
    }
    history.pushState(null, "", pathname + "?" + search.toString());
};

export const setSelectedTagsParams = (
    pathname: string,
    searchParams: URLSearchParams,
    newTags: string[]
) => {
    const search = new URLSearchParams(searchParams);
    if (newTags.length > 0) {
        search.set("tags", newTags.join(","));
    } else {
        search.delete("tags");
    }
    history.pushState(null, "", pathname + "?" + search.toString());
};
