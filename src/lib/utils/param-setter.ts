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

export const addSelectedTagParam = (
    pathname: string,
    searchParams: URLSearchParams,
    tagToAdd: string
) => {
    const search = new URLSearchParams(searchParams);
    const currentTags = search.get("tags")?.split(",") || [];
    if (currentTags.includes(tagToAdd)) {
        return true;
    }
    currentTags.push(tagToAdd);
    search.set("tags", currentTags.join(","));
    history.pushState(null, "", pathname + "?" + search.toString());
    return true;
};

export const setSelectedLabParams = (
    pathname: string,
    searchParams: URLSearchParams,
    newLabSlug: string
) => {
    const search = new URLSearchParams(searchParams);
    if (newLabSlug === "") {
        search.delete("exp");
    } else {
        search.set("exp", newLabSlug);
    }
    history.pushState(null, "", pathname + "?" + search.toString());
};
