import { LabCard } from "@/app/components/cards/lab-card";
import { Separator } from "@/components/ui/separator";
import { getPublicLabsDTO } from "@/data/dto/getters/get-lab-dto";
import { LabDTO } from "@/types/dtos";

export async function LabGallery() {
    const labs = await getPublicLabsDTO();
    const sanitizedLabs = labs.filter(
        (lab) => lab.slug !== "universe"
    );
    if (!sanitizedLabs) return <div>No labs found.</div>;

    return (
        <div className="flex items-center w-full max-w-6xl my-10 px-4 md:px-6">
            <div className={"flex flex-col w-full items-center"}>
                <article className="self-start">
                    <h1 className={"prose-h1"}>Our Heritage Labs</h1>
                    <p className="text-muted-foreground prose-lead">
                        Explore the diverse labs created by our other
                        community Heritage Labs.
                    </p>
                </article>
                <Separator className={"my-8"}></Separator>
                <div className="grid grid-flow-row-dense max-w-6xl grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
                    {sanitizedLabs.map((lab: LabDTO) => (
                        <LabCard
                            key={lab.slug}
                            lab={lab}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
