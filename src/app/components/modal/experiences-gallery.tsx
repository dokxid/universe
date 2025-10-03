import { ExperienceCard } from "@/app/components/cards/experience-card";
import { ListExperiencesSkeleton } from "@/components/skeletons/list-experiences-skeleton";
import { Separator } from "@/components/ui/separator";
import { getExperiencesDTO } from "@/data/dto/experience-dto";
import { Experience } from "@/types/dtos";

export async function ExperiencesGallery() {
    const experiences = await getExperiencesDTO();
    if (!experiences) return <div>No experiences found.</div>;

    return (
        <div className="flex items-center w-full max-w-6xl my-10 px-4 md:px-6">
            <div className={"flex flex-col w-full items-center"}>
                <article className="self-start">
                    <h1 className={"prose-h1"}>Our Heritage Labs</h1>
                    <p className="text-muted-foreground prose-lead">
                        Explore the diverse experiences created by our other
                        community Heritage Labs.
                    </p>
                </article>
                <Separator className={"my-8"}></Separator>
                <div className="grid grid-flow-row-dense max-w-6xl grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
                    {experiences.map((experience: Experience) => (
                        <ExperienceCard
                            key={experience.slug}
                            experience={experience}
                        />
                    ))}
                    {Array.from({ length: 16 }).map((_, index) => (
                        <ListExperiencesSkeleton key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}
