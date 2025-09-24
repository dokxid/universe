import ContentLayout from "@/app/components/layout/content-layout";
import { TeamSettingsDialog } from "@/app/components/modal/team-settings-dialog";
import { getExperienceDTO } from "@/data/dto/experience-dto";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const experience = JSON.stringify(await getExperienceDTO(slug));
    return (
        <ContentLayout slug={slug} feature={"Team settings"}>
            <TeamSettingsDialog slug={slug} experienceSerialized={experience} />
        </ContentLayout>
    );
}
//
