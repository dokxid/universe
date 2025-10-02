import AddStoryForm from "@/app/components/form/add-story-form";
import ContentLayout from "@/app/components/layout/content-layout";
import { getExperiencesDTO } from "@/data/dto/experience-dto";
import { getTagsDTO } from "@/data/dto/tag-dto";

export async function generateStaticParams() {
    const experiences = await getExperiencesDTO();
    return experiences.map((experience) => ({
        slug: experience.slug,
    }));
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
            <div
                className={
                    "flex flex-col gap-4 items-center container w-full lg:w-2/3 max-w-2xl mx-auto my-4 *:w-full"
                }
            >
                <AddStoryForm slug={slug} tagsPromise={tagsPromise} />
            </div>
        </ContentLayout>
    );
}
