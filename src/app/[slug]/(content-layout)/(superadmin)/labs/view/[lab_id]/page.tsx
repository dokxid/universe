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
import { getLabByObjectIdDTO } from "@/data/dto/experience-dto";
import { BookKey } from "lucide-react";

export default async function PrivacyPage({
    params,
}: {
    params: { lab_id: string };
}) {
    const { lab_id } = await params;
    const labDetails = await getLabByObjectIdDTO(lab_id);

    const { stories, __v, ...rest } = labDetails;
    const labDetailsFiltered = rest;

    return (
        <>
            <ContentLayout>
                <Header>
                    <HeaderIcon>
                        <BookKey size={80} />
                    </HeaderIcon>
                    <HeaderContent>
                        <HeaderTitle>View Lab</HeaderTitle>
                        <HeaderDescription>
                            Here you can view the details of the lab with ID:{" "}
                            {lab_id}
                        </HeaderDescription>
                    </HeaderContent>
                </Header>
                <ContentLayoutInner>
                    {Object.entries(rest).map(([key, value]) => (
                        <p key={key}>
                            <b>{key}</b>: {JSON.stringify(value)}
                        </p>
                    ))}
                    stories amount: {stories.length}
                </ContentLayoutInner>
            </ContentLayout>
        </>
    );
}
