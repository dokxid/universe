import StoryEdit from "@/app/components/views/story-edit";
import { getStoryDTO } from "@/data/dto/story-dto";
import { getTagsDTO } from "@/data/dto/tag-dto";

export default async function StoryDetails({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: storyId } = await params;
    const story = await getStoryDTO(storyId);
    const allTags = await getTagsDTO();

    return (
        <StoryEdit story={story} allTags={allTags} />
        // <>
        //     <div className={"w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80"}>
        //         <StoryImage imageUrl={story.featured_image_url} />
        //     </div>
        //     <div className="flex flex-col w-full p-4 px-8">
        //         <div className="prose dark:prose-invert mb-8">
        //             <h1>
        //                 {story.title}
        //                 <PenLine
        //                     className={
        //                         "ml-4 inline stroke-accent hover:stroke-primary transition-all hover:cursor-pointer"
        //                     }
        //                 />
        //             </h1>
        //             <p className="text-sm text-gray-500 mb-10">
        //                 By {story.author_name} | Published on{" "}
        //                 {new Date(story.createdAt).toLocaleDateString()}
        //             </p>
        //         </div>
        //         <EditorView storySerialized={storySerialized} />
        //     </div>
        // </>
    );
}
