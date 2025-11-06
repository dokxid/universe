import AddStoryForm from "@/app/components/form/story-forms/add-story-form";
import {
    ContentLayout,
    ContentLayoutInner,
} from "@/app/components/layout/content-layout";
import {
    Header,
    HeaderContent,
    HeaderDescription,
    HeaderIcon,
    HeaderTitle,
} from "@/app/components/layout/header";
import { getTagsDTO } from "@/data/dto/getters/get-tag-dto";
import { Newspaper } from "lucide-react";


export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const tagsPromise = getTagsDTO();

    return (
        <ContentLayout>
            <Header>
                <HeaderIcon>
                    <Newspaper size={80} />
                </HeaderIcon>
                <HeaderContent>
                    <HeaderTitle>Create a new story</HeaderTitle>
                    <HeaderDescription>
                        Fill your labs map with engaging stories. Use the form
                        below to add a new story to your lab&apos;s collection.
                    </HeaderDescription>
                </HeaderContent>
            </Header>
            <ContentLayoutInner>
                <AddStoryForm slug={slug} tagsPromise={tagsPromise} />
            </ContentLayoutInner>
        </ContentLayout>
    );
}
