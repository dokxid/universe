"use client";

import { StoryCard } from "@/app/components/cards/story-card";
import { TagSpan } from "@/app/components/cards/tag-span";
import {
    Header,
    HeaderContent,
    HeaderDescription,
    HeaderIcon,
    HeaderTitle,
} from "@/app/components/layout/header";
import { FilterStoriesDialog } from "@/app/components/modal/filter-stories-dialog";
import { ListExperiencesSkeleton } from "@/components/skeletons/list-experiences-skeleton";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { getTagColorHex } from "@/lib/utils/color-string";
import { StoryDTO, UnescoTagDTO } from "@/types/dtos";
import { LibraryBig, SortAsc, SortDesc } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { use, useMemo, useState } from "react";

function UniverseStoryCollectionHeader() {
    return (
        <p className="text-muted-foreground prose-lead">
            Read through the diverse stories created by our community.
        </p>
    );
}

function LabStoryCollectionHeader({ slug }: { slug: string }) {
    return (
        <p className="text-muted-foreground prose-lead">
            Read through the diverse stories created by our{" "}
            <Link
                href={`/${slug}/about`}
                className={
                    "text-blue-500 dark:text-blue-300 font-semibold hover:underline after:content-['_↗']"
                }
            >
                Heritage Lab
            </Link>
        </p>
    );
}

export function StoryCollection({
    storiesPromise,
    tagsPromise,
}: {
    storiesPromise: Promise<StoryDTO[]>;
    tagsPromise: Promise<UnescoTagDTO[]>;
}) {
    const [titleFilter, setTitleFilter] = useState("");
    const [sorting, setSorting] = useState<"asc" | "desc">("desc");
    const stories = use(storiesPromise);
    const tags = use(tagsPromise);
    const pathname = usePathname();
    const slug = pathname.split("/")[1];
    const searchParams = useSearchParams();
    const selectedFilterTags = searchParams.get("tags")?.split(",") || null;

    const filteredStories = useMemo(() => {
        let filteredStories = stories.filter((story) =>
            story.title.toLocaleLowerCase().includes(titleFilter.toLowerCase())
        );
        if (selectedFilterTags !== null) {
            filteredStories = filteredStories.filter((story) =>
                story.tags.some((tag) => selectedFilterTags.includes(tag))
            );
        }
        if (sorting === "asc") {
            filteredStories.sort(
                (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
            );
        } else {
            filteredStories.sort(
                (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
            );
        }
        return filteredStories;
    }, [stories, titleFilter, sorting, selectedFilterTags]);

    const clearFilters = () => {
        setTitleFilter("");
        history.pushState(null, "", pathname);
    };

    return (
        <div className="flex items-center w-full max-w-6xl my-10 px-4 lg:px-6">
            <div className={"flex flex-col w-full items-center"}>
                <Header>
                    <HeaderIcon>
                        <LibraryBig size={80} />
                    </HeaderIcon>
                    <HeaderContent>
                        <HeaderTitle>Stories</HeaderTitle>
                        <HeaderDescription>
                            {slug === "universe" ? (
                                <UniverseStoryCollectionHeader />
                            ) : (
                                <LabStoryCollectionHeader slug={slug} />
                            )}
                        </HeaderDescription>
                    </HeaderContent>
                </Header>
                <div className={"mb-6 flex flex-col w-full gap-4"}>
                    <div
                        className={
                            "flex flex-col lg:flex-row gap-2 w-full justify-between"
                        }
                    >
                        <Input
                            type="text"
                            placeholder="Filter by title..."
                            value={titleFilter}
                            onChange={(e) => setTitleFilter(e.target.value)}
                            className="w-full max-w-full lg:max-w-sm self-start mb-2 lg:mb-0"
                        ></Input>
                        <div className="flex flex-row gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="secondary" size={"icon"}>
                                        {sorting === "asc" ? (
                                            <SortAsc />
                                        ) : (
                                            <SortDesc />
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>
                                        Sorting options
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuCheckboxItem
                                        checked={sorting === "desc"}
                                        onCheckedChange={() =>
                                            setSorting("desc")
                                        }
                                    >
                                        Newest first
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={sorting === "asc"}
                                        onCheckedChange={() =>
                                            setSorting("asc")
                                        }
                                    >
                                        Oldest first
                                    </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <FilterStoriesDialog tagsPromise={tagsPromise} />
                            <Button
                                variant={"secondary"}
                                onClick={clearFilters}
                            >
                                Clear Filter
                            </Button>
                        </div>
                    </div>
                    <div className={"self-start"}>
                        {selectedFilterTags && (
                            <div className="flex flex-wrap gap-2">
                                filtered by:{" "}
                                {selectedFilterTags.map((tag) => (
                                    <TagSpan
                                        key={tag}
                                        tag={tag}
                                        variant={"remove"}
                                        color={getTagColorHex(tags, tag)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                {filteredStories.length === 0 && (
                    <div
                        className={
                            "p-5 mt-5 mb-9 bg-accent text-accent-foreground rounded-md w-full"
                        }
                    >
                        No stories found for this lab.
                    </div>
                )}
                <div className="grid grid-flow-row-dense max-w-6xl grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
                    {filteredStories.map((story) => (
                        <StoryCard key={story._id} story={story} tags={tags} />
                    ))}
                    {filteredStories.length === 0 && (
                        <>
                            <ListExperiencesSkeleton />
                            <ListExperiencesSkeleton />
                            <ListExperiencesSkeleton />
                            <ListExperiencesSkeleton />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
