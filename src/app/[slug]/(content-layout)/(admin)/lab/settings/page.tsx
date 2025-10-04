import { ContentLayout } from "@/app/components/layout/content-layout";
import {
    Header,
    HeaderContent,
    HeaderDescription,
    HeaderIcon,
    HeaderTitle,
} from "@/app/components/layout/header";
import { TeamSettingsDialog } from "@/app/components/modal/team-settings-dialog";
import { getExperienceDTO, getExperiencesDTO } from "@/data/dto/experience-dto";
import { Newspaper } from "lucide-react";

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
        <>
            <ContentLayout>
                <Header>
                    <HeaderIcon>
                        <Newspaper size={80} />
                    </HeaderIcon>
                    <HeaderContent>
                        <HeaderTitle>Elevation Requests</HeaderTitle>
                        <HeaderDescription>
                            Manage the elevation requests in all labs. Reject or
                            approve them as needed.
                        </HeaderDescription>
                    </HeaderContent>
                </Header>
                <TeamSettingsDialog
                    slug={slug}
                    experienceSerialized={experience}
                />
            </ContentLayout>
        </>
    );
}
