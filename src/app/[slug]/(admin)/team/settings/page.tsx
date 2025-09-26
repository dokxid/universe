import ContentLayout from "@/app/components/layout/content-layout";
import { TeamSettingsDialog } from "@/app/components/modal/team-settings-dialog";
import { GenericFormSkeleton } from "@/components/skeletons/generic-form-skeleton";
import { getExperienceDTO } from "@/data/dto/experience-dto";
import { Suspense } from "react";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const experience = JSON.stringify(await getExperienceDTO(slug));
    return (
        <ContentLayout slug={slug} feature={"Team settings"}>
            <Suspense fallback={<GenericFormSkeleton />}>
                <TeamSettingsDialog
                    slug={slug}
                    experienceSerialized={experience}
                />
            </Suspense>
        </ContentLayout>
    );
}
