import ContentLayout from "@/app/components/layout/content-layout";
import { ListExperiencesDialog } from "@/app/components/modal/list-experiences-dialog";

export default async function ExperiencesPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    return (
        <ContentLayout slug={slug} feature={"Experiences"}>
            <ListExperiencesDialog />
        </ContentLayout>
    );
}
