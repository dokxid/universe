import { TeamSettingsDialog } from "@/app/components/modal/team-settings-dialog";
import { GenericFormSkeleton } from "@/components/skeletons/generic-form-skeleton";
import { getExperienceDTO, getExperiencesDTO } from "@/data/dto/experience-dto";
import { Suspense } from "react";

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
    const experience = JSON.stringify(await getExperienceDTO(slug));
    return (
        <Suspense fallback={<GenericFormSkeleton />}>
            <TeamSettingsDialog slug={slug} experienceSerialized={experience} />
        </Suspense>
    );
}
