import S3Image from "@/app/components/embeds/s3-image";
import { getStoryDTO } from "@/data/dto/story-dto";
import parse from "html-react-parser";

export default async function StoryView({ storyId }: { storyId: string }) {
    const storySerialized = await getStoryDTO(storyId);
    const story = await storySerialized;
    return (
        <>
            <div className={"w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80"}>
                <S3Image
                    experience={story.experience}
                    fileName={story.featured_image_url}
                />
            </div>
            <div className="flex-1 p-4 px-8 prose dark:prose-invert mb-15">
                <h1 className="flex flex-row items-center">{story.title}</h1>
                <p className="text-sm text-gray-500 mb-4">
                    By {story.author_name} | Published on{" "}
                    {new Date(story.createdAt).toLocaleDateString()}
                </p>
                <div className="prose-content">{parse(story.content)}</div>
            </div>
        </>
    );
}
