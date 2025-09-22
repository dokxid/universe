import { AppSidebar } from "@/app/components/sidebar/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { getStoryDTO } from "@/data/dto/story-dto";
import { Story } from "@/types/api";
import parse from "html-react-parser";

export default async function StoryDetails({
    params,
}: {
    params: Promise<{ slug: string; id: string }>;
}) {
    const { slug, id: storyId } = await params;
    const storySerialized = await getStoryDTO(storyId);
    const story = JSON.parse(storySerialized) as Story;
    console.log("Story:", story);

    return (
        <div className="w-full h-full flex">
            <AppSidebar slug={slug} />
            <SidebarInset>
                <div className="flex-1 p-4 prose dark:prose-invert">
                    <h1>{story.title}</h1>
                    <div className="prose-content">{parse(story.content)}</div>
                </div>
            </SidebarInset>
        </div>
    );
}
