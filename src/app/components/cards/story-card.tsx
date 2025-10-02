import S3Image from "@/app/components/embeds/s3-image";
import { ListExperiencesSkeleton } from "@/components/skeletons/list-experiences-skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getTagsDTO } from "@/data/dto/tag-dto";
import { buildStoryLink } from "@/lib/path";
import { getTagColorHex } from "@/lib/utils/color-string";
import { StoryDTO } from "@/types/dtos";
import Link from "next/link";
import { Suspense } from "react";

export async function StoryCard({ story }: { story: StoryDTO }) {
    const tags = await getTagsDTO();
    return (
        <Link
            key={story._id}
            href={buildStoryLink(story)}
            prefetch={false}
            className="flex flex-row items-center w-full gap-2"
        >
            <Card
                key={story._id}
                className={`w-full mx-auto py-0 flex-col shadow-none rounded-md overflow-hidden gap-0 group`}
            >
                <div className="overflow-hidden relative">
                    <AspectRatio
                        ratio={10 / 9}
                        className={
                            "mb-16 origin-bottom group-hover:scale-110 transition-all duration-300 ease-in-out"
                        }
                    >
                        {story.featured_image_url ? (
                            <Suspense fallback={<ListExperiencesSkeleton />}>
                                <S3Image
                                    link={false}
                                    experience={story.experience}
                                    fileName={story.featured_image_url}
                                    className="object-cover "
                                />
                            </Suspense>
                        ) : (
                            <div className="w-full h-full bg-muted rounded-t-md flex items-center justify-center">
                                <span className="text-muted-foreground text-sm">
                                    No image
                                </span>
                            </div>
                        )}
                    </AspectRatio>
                    <div className="absolute bottom-0 left-0 right-0 bg-card group-hover:bg-selected group-hover:text-selected-foreground p-4 group flex flex-row items-center grow h-fit overflow-y-hidden py-4">
                        <div className="flex flex-row items-center w-full gap-2 justify-between h-fit">
                            <div className="flex-1 min-w-0 flex flex-col gap-1">
                                <h1 className="text-base font-semibold truncate group-hover:after:content-['_→']">
                                    {story.title}
                                </h1>
                                <p className="text-sm text-muted-foreground group-hover:text-selected-foreground truncate">
                                    by {story.author_name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    published:{" "}
                                    {new Date(
                                        story.createdAt
                                    ).toLocaleDateString()}
                                </p>
                                <div
                                    className={
                                        "group-hover:flex flex-row flex-wrap gap-2 my-3 hidden group-hover:visible"
                                    }
                                >
                                    {story.tags.map((tag) => (
                                        <Badge
                                            style={{
                                                backgroundColor: getTagColorHex(
                                                    tags,
                                                    tag
                                                ),
                                            }}
                                            variant={"tag"}
                                            key={tag}
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            {/* <div className="shrink-0 ml-2">
                        <ChevronRight className="size-4" />
                    </div> */}
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
