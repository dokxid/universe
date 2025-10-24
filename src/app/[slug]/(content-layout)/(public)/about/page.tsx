import LabView from "@/app/components/views/experience-view";
import { getLabDTO, getLabsDTO } from "@/data/dto/getters/get-experience-dto";

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

export default async function ExperiencesPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const labPromise = getLabDTO(slug);
    if (!labPromise) {
        return <div>Lab not found</div>;
    }

    return <LabView labPromise={labPromise} />;
}
