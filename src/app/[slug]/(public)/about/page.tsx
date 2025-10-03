import ContentLayout from "@/app/components/layout/content-layout";
import ExperienceView from "@/app/components/views/experience-view";
import { getExperienceDTO, getExperiencesDTO } from "@/data/dto/experience-dto";
import { Suspense } from "react";

export async function generateStaticParams() {
    const experiences = await getExperiencesDTO();
    return experiences.map((experience) => ({
        slug: experience.slug,
    }));
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

    return (
        <ContentLayout>
            <Suspense fallback={<div>Loading...</div>}>
                <ExperienceView experiencePromise={experiencePromise} />
            </Suspense>
        </ContentLayout>
    );
}
