import S3Image from "@/app/components/embeds/s3-image";
import ContentLayout from "@/app/components/layout/content-layout";
import EditorView from "@/app/components/stories/editor-view";
import { getStoryDTO } from "@/data/dto/story-dto";
import { PenLine } from "lucide-react";

export default async function StoryDetails({
    params,
}: {
    params: Promise<{ slug: string; id: string }>;
}) {
    const { slug, id: storyId } = await params;
    const story = await getStoryDTO(storyId);
    const storySerialized = JSON.stringify(story);

    return (
        <ContentLayout slug={slug} className={"p-0"}>
            <div className={"w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80"}>
                <S3Image
                    experience={story.experience}
                    fileName={story.featured_image_url}
                />
            </div>
            <div className="flex flex-col w-full p-4 px-8">
                <div className="prose dark:prose-invert mb-8">
                    <h1>
                        {story.title}
                        <PenLine
                            className={
                                "ml-4 inline stroke-accent hover:stroke-primary transition-all hover:cursor-pointer"
                            }
                        />
                    </h1>
                    <p className="text-sm text-gray-500 mb-10">
                        By {story.author_name} | Published on{" "}
                        {new Date(story.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <EditorView storySerialized={storySerialized} />
            </div>
        </ContentLayout>
    );
}
