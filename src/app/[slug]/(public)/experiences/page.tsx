import ContentLayout from "@/app/components/layout/content-layout";
import { ExperiencesGallery } from "@/app/components/modal/experiences-gallery";
import { Suspense } from "react";

export const experimental_ppr = true;

export default async function ExperiencesPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return (
        <ContentLayout slug={slug} feature={"Heritage Labs"}>
            <Suspense fallback={<div>Loading...</div>}>
                <ExperiencesGallery />
            </Suspense>
        </ContentLayout>
    );
}
