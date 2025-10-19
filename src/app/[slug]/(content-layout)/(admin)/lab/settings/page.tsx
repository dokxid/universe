import {
    ContentLayout,
    ContentLayoutInner,
} from "@/app/components/layout/content-layout";
import {
    Header,
    HeaderContent,
    HeaderDescription,
    HeaderIcon,
    HeaderTitle,
} from "@/app/components/layout/header";
import { TeamSettings } from "@/app/components/views/team-settings";
import {
    getExperienceDTO,
    getExperiencesDTO,
} from "@/data/dto/getters/get-experience-dto";
import { Settings } from "lucide-react";

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
                        <Settings size={80} />
                    </HeaderIcon>
                    <HeaderContent>
                        <HeaderTitle>Lab Settings</HeaderTitle>
                        <HeaderDescription>
                            Manage your lab and its public appearance.
                        </HeaderDescription>
                    </HeaderContent>
                </Header>
                <ContentLayoutInner>
                    <TeamSettings
                        slug={slug}
                        experienceSerialized={experience}
                    />
                </ContentLayoutInner>
            </ContentLayout>
        </>
    );
}
