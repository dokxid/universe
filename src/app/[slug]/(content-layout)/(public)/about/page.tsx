import LabView from "@/app/components/views/experience-view";
import {
    getExperienceDTO,
    getExperiencesDTO,
} from "@/data/dto/getters/get-experience-dto";

export async function generateStaticParams() {
    try {
        const experiences = await getExperiencesDTO();
        return experiences.map((experience) => ({
            slug: experience.slug,
        }));
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

export default async function ExperiencesPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const experiencePromise = getExperienceDTO(slug);
    if (!experiencePromise) {
        return <div>Experience not found</div>;
    }

    return <LabView experiencePromise={experiencePromise} />;
}
