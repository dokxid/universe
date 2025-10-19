import { ContentLayout } from "@/app/components/layout/content-layout";
import {
    Header,
    HeaderContent,
    HeaderDescription,
    HeaderIcon,
    HeaderTitle,
} from "@/app/components/layout/header";
import { TeamSettings } from "@/app/components/views/team-settings";
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
                        <HeaderTitle>Lab Settings</HeaderTitle>
                        <HeaderDescription>
                            Manage the settings for your lab.
                        </HeaderDescription>
                    </HeaderContent>
                </Header>
                <TeamSettings
                    slug={slug}
                    experienceSerialized={experience}
                />
            </ContentLayout>
        </>
    );
}
