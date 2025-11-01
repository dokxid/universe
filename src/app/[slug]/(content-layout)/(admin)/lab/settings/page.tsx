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
import { LabSettings } from "@/app/components/views/lab-settings";
import { getLabDTO, getLabsDTO } from "@/data/dto/getters/get-lab-dto";
import { Settings } from "lucide-react";

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

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const lab = JSON.stringify(await getLabDTO(slug));
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
                    <LabSettings slug={slug} labSerialized={lab} />
                </ContentLayoutInner>
            </ContentLayout>
        </>
    );
}
