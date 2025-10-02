import ContentLayout from "@/app/components/layout/content-layout";
import { StoryGallery } from "@/app/components/modal/story-gallery";
import { getExperiencesDTO } from "@/data/dto/experience-dto";

export const experimental_ppr = true;

export async function generateStaticParams() {
    const experiences = await getExperiencesDTO();
    return experiences.map((experience) => ({
        slug: experience.slug,
    }));
}

export default async function StoriesPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return (
        <ContentLayout>
            <StoryGallery slug={slug} />
        </ContentLayout>
    );
}
