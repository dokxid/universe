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
import { TeamSettings } from "@/app/components/views/lab-settings";
import { getLabDTO, getLabsDTO } from "@/data/dto/getters/get-experience-dto";
import { Settings } from "lucide-react";

export async function generateStaticParams() {
    try {
        const experiences = await getLabsDTO();
        return experiences.map((experience) => ({
            slug: experience.slug,
        }));
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const experience = JSON.stringify(await getLabDTO(slug));
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
                    <TeamSettings slug={slug} labSerialized={experience} />
                </ContentLayoutInner>
            </ContentLayout>
        </>
    );
}
