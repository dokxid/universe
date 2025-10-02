"use client";

import { StoryCard } from "@/app/components/cards/story-card";
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
import { Separator } from "@/components/ui/separator";
import { StoryDTO, UnescoTagDTO } from "@/types/dtos";
import { Filter, LibraryBig, SortAsc, SortDesc } from "lucide-react";
import { usePathname } from "next/navigation";
import { use, useMemo, useState } from "react";

function universeStoryGalleryHeader() {
    return (
        <>
            <h1 className={"prose-h1"}>Stories</h1>
            <p className="text-muted-foreground prose-lead">
                Read through the diverse stories created by our community.
            </p>
        </>
    );
}

function labStoryGalleryHeader() {
    return (
        <>
            <h1 className={"prose-h1 mb-2"}>Stories</h1>
            <p className="text-muted-foreground prose-lead">
                Read through the diverse stories created by our Heritage Lab.
            </p>
        </>
    );
}

export function StoryGallery({
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

    const filteredStories = useMemo(() => {
        const filteredStories = stories.filter((story) =>
            story.title.toLocaleLowerCase().includes(titleFilter.toLowerCase())
        );
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
    }, [stories, titleFilter, sorting]);

    return (
        <div className="flex items-center w-full max-w-6xl my-10 px-4 md:px-6">
            <div className={"flex flex-col w-full items-center"}>
                <div className={"flex flex-row w-full items-center"}>
                    <LibraryBig size={48} className={"mr-4"} />
                    <article className="self-start">
                        {slug === "universe"
                            ? universeStoryGalleryHeader()
                            : labStoryGalleryHeader()}
                    </article>
                </div>
                <Separator className={"my-8"}></Separator>
                <div className={"flex flex-row gap-2 w-full mb-4"}>
                    <Input
                        type="text"
                        placeholder="Filter by title..."
                        value={titleFilter}
                        onChange={(e) => setTitleFilter(e.target.value)}
                        className="mb-4 w-full max-w-sm self-start"
                    ></Input>
                    <div className="flex-grow"></div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="default" size={"icon"}>
                                {sorting === "asc" ? <SortAsc /> : <SortDesc />}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>
                                Sorting options
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem
                                checked={sorting === "desc"}
                                onCheckedChange={() => setSorting("desc")}
                            >
                                Newest first
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={sorting === "asc"}
                                onCheckedChange={() => setSorting("asc")}
                            >
                                Oldest first
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        size={"icon"}
                        variant={"default"}
                        onClick={() => setTitleFilter("")}
                    >
                        <Filter></Filter>
                    </Button>
                    <Button
                        variant={"default"}
                        onClick={() => setTitleFilter("")}
                    >
                        Clear Filter
                    </Button>
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
