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
import { getLabsDTO } from "@/data/dto/getters/get-lab-dto";
import { getTagsDTO } from "@/data/dto/getters/get-tag-dto";
import { Newspaper } from "lucide-react";

export async function generateStaticParams() {
    try {
        const labs = await getLabsDTO();
        return labs.map((lab) => ({
            slug: lab.slug,
        }));
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

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
