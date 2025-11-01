import { StoryCollection } from "@/app/components/views/story-collection";
import { getLabsDTO } from "@/data/dto/getters/get-lab-dto";
import {
    getAllPublicStoriesDTO,
    getLabPublicStoriesDTO,
} from "@/data/dto/getters/get-story-dto";
import { getUniqueTagDTOsForLab } from "@/data/dto/getters/get-tag-dto";

export const experimental_ppr = true;

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

export default async function StoriesPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const tagsPromise = getUniqueTagDTOsForLab(slug);

    // fetch stories based on slug
    let storiesPromise;
    if (slug === "universe") {
        storiesPromise = getAllPublicStoriesDTO();
    } else {
        storiesPromise = getLabPublicStoriesDTO(slug);
    }

    return (
        <StoryCollection
            storiesPromise={storiesPromise}
            tagsPromise={tagsPromise}
        />
    );
}
