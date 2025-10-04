import { TagList } from "@/app/components/cards/tag-list";
import S3Image from "@/app/components/embeds/s3-image";
import { Card } from "@/components/ui/card";
import { buildStoryLink } from "@/lib/path";
import { StoryDTO } from "@/types/dtos";
import Link from "next/link";

export function StoryCard({ story }: { story: StoryDTO }) {
    return (
        <Link
            key={story._id}
            href={buildStoryLink(story)}
            prefetch={true}
            className="flex flex-row items-center w-full gap-2"
            data-testid={"story-card-link"}
        >
            <Card
                key={story._id}
                className={`w-full mx-auto py-0 flex-col shadow-none rounded-md overflow-hidden gap-0 group`}
            >
                <div className="overflow-hidden relative">
                    <div
                        className={
                            "origin-bottom group-hover:scale-110 transition-all duration-300 ease-in-out h-60 md:h-90 group-hover:brightness-25"
                        }
                    >
                        {story.featured_image_url ? (
                            <S3Image
                                link={false}
                                experience={story.experience}
                                fileName={story.featured_image_url}
                                className="object-cover "
                            />
                        ) : (
                            <div className="w-full h-full bg-muted rounded-t-md flex items-center justify-center">
                                <span className="text-muted-foreground text-sm">
                                    No image
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-card group-hover:bg-transparent group-hover:text-selected-foreground p-4 group flex flex-row items-center grow h-fit overflow-y-hidden py-4">
                        <div className="flex flex-row items-center w-full gap-2 justify-between h-fit">
                            <div className="flex-1 min-w-0 flex flex-col gap-1">
                                <h1 className="text-base font-bold line-clamp-1 group-hover:line-clamp-3 group-hover:text-white group-hover:text-xl group-hover:font-black group-hover:after:content-['_→']">
                                    {story.title}
                                </h1>
                                <p className="text-sm text-muted-foreground group-hover:text-white group-hover:font-semibold truncate">
                                    by {story.author_name}
                                </p>
                                <p className="text-xs text-muted-foreground group-hover:text-gray-300 group-hover:font-semibold truncate">
                                    published:{" "}
                                    {new Date(
                                        story.createdAt
                                    ).toLocaleDateString()}
                                </p>
                                <TagList
                                    tags={story.tags}
                                    variant={"add"}
                                    className={"hidden group-hover:flex"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
