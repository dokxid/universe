import { StoryCard } from "@/app/components/cards/story-card";
import { ListExperiencesSkeleton } from "@/components/skeletons/list-experiences-skeleton";
import { Separator } from "@/components/ui/separator";
import {
    getAllPublicStoriesDTO,
    getLabPublicStoriesDTO,
} from "@/data/dto/story-dto";
import { StoryDTO } from "@/types/dtos";

export async function StoryGallery({ slug }: { slug: string }) {
    let stories: StoryDTO[] = [];
    if (slug === "universe") {
        stories = await getAllPublicStoriesDTO();
    } else {
        stories = await getLabPublicStoriesDTO(slug);
    }
    if (!stories) return <div>No stories found.</div>;

    return (
        <div className="flex items-center w-full max-w-6xl my-10 px-4 md:px-6">
            <div className={"flex flex-col w-full items-center"}>
                <article className="self-start">
                    <h1 className={"prose-h1"}>Stories</h1>
                    <p className="text-muted-foreground prose-lead">
                        Explore the diverse stories created by our community.
                    </p>
                </article>
                <Separator className={"my-8"}></Separator>
                <div className="grid grid-flow-row-dense max-w-6xl grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
                    {stories.map((story) => (
                        <StoryCard key={story._id} story={story} />
                    ))}
                    {Array.from({ length: 16 }).map((_, index) => (
                        <ListExperiencesSkeleton key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}
