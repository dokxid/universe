import ContentLayout from "@/app/components/layout/content-layout";
import { ExperiencesGallery } from "@/app/components/modal/experiences-gallery";
import { Suspense } from "react";

export const experimental_ppr = true;

export default async function ExperiencesPage() {
    return (
        <ContentLayout>
            <Suspense fallback={<div>Loading...</div>}>
                <ExperiencesGallery />
            </Suspense>
        </ContentLayout>
    );
}
