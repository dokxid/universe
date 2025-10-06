import { TagList } from "@/app/components/cards/tag-list";
import S3Image from "@/app/components/embeds/s3-image";
import {
    ContentLayout,
    ContentLayoutInner,
    SettingsFormButtonGroup,
} from "@/app/components/layout/content-layout";
import {
    Header,
    HeaderContent,
    HeaderDescription,
    HeaderTitle,
} from "@/app/components/layout/header";
import { StoryViewDetails } from "@/app/components/layout/story-view-details";
import { Button } from "@/components/ui/button";
import { getStoryDTO } from "@/data/dto/story-dto";
import parse from "html-react-parser";
import Link from "next/link";

export default async function StoryView({ storyId }: { storyId: string }) {
    const story = await getStoryDTO(storyId);
    return (
        <div className={"flex flex-col gap-4 items-center w-full"}>
            <div className={"w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80"}>
                <S3Image
                    experience={story.experience}
                    fileName={story.featured_image_url}
                />
            </div>
            <ContentLayout>
                <Header>
                    <div className={"flex flex-col gap-3 w-full"}>
                        <TagList
                            tags={story.tags}
                            variant={"default"}
                            className={"max-w-lg"}
                        />
                        <div className={"flex flex-row justify-between w-full"}>
                            <HeaderContent className={"flex flex-col"}>
                                <HeaderTitle>{story.title}</HeaderTitle>
                                <HeaderDescription>
                                    <StoryViewDetails
                                        author={story.author_name}
                                        slug={story.experience}
                                        createdAt={story.createdAt}
                                    />
                                    {/* {story.author_name} - Published on{" "}
                                {new Date(story.createdAt).toLocaleDateString()} */}
                                </HeaderDescription>
                            </HeaderContent>
                            <SettingsFormButtonGroup
                                className={"h-full self-start"}
                            >
                                <Link
                                    href={`/${story.experience}/stories/edit/${story._id}`}
                                >
                                    <Button variant={"secondary_custom"}>
                                        Edit
                                    </Button>
                                </Link>
                                <Link
                                    href={`/${story.experience}/map?story=${story._id}`}
                                >
                                    <Button variant={"primary_custom"}>
                                        View on map
                                    </Button>
                                </Link>
                            </SettingsFormButtonGroup>
                        </div>
                    </div>
                </Header>
                <ContentLayoutInner>
                    <div>
                        <div className="prose dark:prose-invert prose-headings:mb-2 mt-3">
                            {parse(story.content)}
                        </div>
                    </div>
                </ContentLayoutInner>
            </ContentLayout>
        </div>
    );
}
