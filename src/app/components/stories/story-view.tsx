import S3Image from "@/app/components/s3-image";
import { getCurrentUserOptional } from "@/data/auth";
import { canUserEditStory, getStoryDTO } from "@/data/dto/story-dto";
import parse from "html-react-parser";
import { PenLine } from "lucide-react";
import Link from "next/link";

export default async function StoryView({ storyId }: { storyId: string }) {
    const user = await getCurrentUserOptional();
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
            <div className="flex-1 p-4 px-8 prose dark:prose-invert">
                <h1 className="flex flex-row items-center">
                    {story.title}
                    {(await canUserEditStory(user, story)) && (
                        <Link
                            href={`/${story.experience}/stories/edit/${story._id}`}
                        >
                            <PenLine
                                className={
                                    "ml-4 stroke-accent hover:stroke-primary inline transition-all hover:cursor-pointer"
                                }
                            />
                        </Link>
                    )}
                </h1>
                <p className="text-sm text-gray-500 mb-4">
                    By {story.author_name} | Published on{" "}
                    {new Date(story.createdAt).toLocaleDateString()}
                </p>
                <div className="prose-content">{parse(story.content)}</div>
            </div>
        </>
    );
}
