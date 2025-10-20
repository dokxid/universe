import { DebugListObject } from "@/app/components/cards/debug-list-object";
import { TagList } from "@/app/components/cards/tag-list";
import { HostedImage } from "@/app/components/embeds/s3-image";
import {
    ContentLayout,
    ContentLayoutInner,
    SettingsLayout,
} from "@/app/components/layout/content-layout";
import {
    Header,
    HeaderContent,
    HeaderDescription,
    HeaderTitle,
} from "@/app/components/layout/header";
import { StoryAuthorDetails } from "@/app/components/layout/story-author-details";
import { EditStoryButtons } from "@/app/components/views/edit-story-buttons";
import { Badge } from "@/components/ui/badge";
import { StoryDTO } from "@/types/dtos";
import parse from "html-react-parser";

export default async function StoryView({ story }: { story: StoryDTO }) {
    return (
        <ContentLayout>
            <div className={"w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 mb-8"}>
                <HostedImage fileName={story.featuredImageUrl} />
            </div>
            <Header>
                <div className={"flex flex-col gap-3 w-full"}>
                    <TagList
                        tags={story.tags}
                        variant={"default"}
                        className={"max-w-lg"}
                    />
                    <div className={"flex flex-row justify-between w-full"}>
                        <HeaderContent className={"flex flex-col"}>
                            <HeaderTitle className={"flex items-center gap-2"}>
                                {story.title}{" "}
                                {story.draft && (
                                    <Badge
                                        variant={"secondary"}
                                        className="text-sm"
                                    >
                                        Draft
                                    </Badge>
                                )}
                            </HeaderTitle>
                            <HeaderDescription>
                                <StoryAuthorDetails story={story} />
                                {/* {story.author_name} - Published on{" "}
                                {new Date(story.createdAt).toLocaleDateString()} */}
                            </HeaderDescription>
                        </HeaderContent>
                        <EditStoryButtons story={story} />
                    </div>
                </div>
            </Header>
            <ContentLayoutInner>
                <div className="prose dark:prose-invert prose-headings:mb-2 mt-3">
                    {parse(story.content)}
                </div>
                <SettingsLayout className={""}>
                    <DebugListObject data={story} />
                </SettingsLayout>
            </ContentLayoutInner>
        </ContentLayout>
    );
}
