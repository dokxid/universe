import { ListExperiencesSkeleton } from "@/components/skeletons/list-experiences-skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { setSelectedLabParams } from "@/lib/utils/param-setter";
import { ExperienceDTO } from "@/types/dtos";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export function ExploreExperienceCard({
    experience,
    queryStringURL = false,
}: {
    experience: ExperienceDTO;
    queryStringURL?: boolean;
}) {
    const searchParams = useSearchParams();
    const selectedExperience = searchParams.get("exp");
    function createExperienceParam(slug: string) {
        const search = new URLSearchParams(searchParams.toString());
        search.delete("story");
        search.set("exp", slug);
        return "?" + search.toString();
    }
    let url;
    if (queryStringURL) {
        url = `/universe/map${createExperienceParam(experience.slug)}`;
    } else {
        url = `/${experience.slug}/map`;
    }

    return (
        <Card
            onClick={() =>
                setSelectedLabParams(
                    "/universe/map",
                    searchParams,
                    experience.slug
                )
            }
            key={experience.slug}
            className={`w-full mx-auto py-0 flex-col hover:bg-accent shadow-none gap-0 h-60 group ${
                experience.slug === selectedExperience
                    ? "bg-secondary text-secondary-foreground"
                    : ""
            }`}
        >
            <div className="overflow-hidden rounded-t-md group-hover:h-6 shrink">
                <AspectRatio ratio={16 / 9}>
                    {experience.featured_image_url ? (
                        <Suspense fallback={<ListExperiencesSkeleton />}>
                            <Image
                                src={experience.featured_image_url}
                                alt={experience.title}
                                fill={true}
                                sizes="(min-width: 768px) 50vw, 100vw"
                                className="group-hover:opacity-75 transition-translate duration-100 object-cover group-hover:-translate-y-10"
                            />
                        </Suspense>
                    ) : (
                        <div className="w-full h-full bg-muted rounded-t-md flex items-center justify-center">
                            <span className="text-muted-foreground text-sm">
                                No image
                            </span>
                        </div>
                    )}
                </AspectRatio>
            </div>
            <div className="p-4 group flex flex-row items-center grow h-fit max-h-60 overflow-y-hidden">
                <div className="flex flex-row items-center w-full gap-2 justify-between h-fit">
                    <div className="flex-1 min-w-0 flex flex-col gap-0">
                        <h2 className="text-base font-semibold truncate group-hover:underline">
                            {experience.title}
                        </h2>
                        <h3 className="text-sm text-muted-foreground line-clamp-1 group-hover:line-clamp-2">
                            {experience.subtitle}
                        </h3>
                        <p
                            className={
                                "text-xs text-muted-foreground line-clamp-1 group-hover:line-clamp-6 mt-0.5 group-hover:mt-4"
                            }
                        >
                            {experience.description}
                        </p>
                    </div>
                    {/* <div className="shrink-0 ml-2">
                        <ChevronRight className="size-4" />
                    </div> */}
                </div>
            </div>
        </Card>
    );
}
