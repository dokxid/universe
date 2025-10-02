import ContentLayout from "@/app/components/layout/content-layout";
import { StoryGallery } from "@/app/components/modal/story-gallery";
import { getExperiencesDTO } from "@/data/dto/experience-dto";
import {
    getAllPublicStoriesDTO,
    getLabPublicStoriesDTO,
} from "@/data/dto/story-dto";
import { getTagsDTO } from "@/data/dto/tag-dto";

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
    const tagsPromise = getTagsDTO();

    // fetch stories based on slug
    let storiesPromise;
    if (slug === "universe") {
        storiesPromise = getAllPublicStoriesDTO();
    } else {
        storiesPromise = getLabPublicStoriesDTO(slug);
    }

    return (
        <ContentLayout>
            <StoryGallery
                storiesPromise={storiesPromise}
                tagsPromise={tagsPromise}
            />
        </ContentLayout>
    );
}
