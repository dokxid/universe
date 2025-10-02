import { ListExperiencesSkeleton } from "@/components/skeletons/list-experiences-skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getExperiencesDTO } from "@/data/dto/experience-dto";
import { Experience } from "@/types/dtos";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export async function ExperiencesGallery() {
    const experiences = await getExperiencesDTO();
    if (!experiences) return <div>No experiences found.</div>;

    return (
        <div className={"flex flex-col w-full items-start"}>
            <article className="prose dark:prose-invert p-2 md:p-5">
                <h1>Our Heritage Labs</h1>
                <p className="text-muted-foreground">
                    Explore the diverse experiences created by our other
                    community Heritage Labs.
                </p>
            </article>
            <Separator className={"my-4"}></Separator>
            <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full p-2 md:p-5">
                {experiences.map((experience: Experience) => (
                    <Link
                        key={experience.slug}
                        href={`/${experience.slug}/map`}
                        className="flex flex-row justify-between items-center w-full gap-2 group"
                    >
                        <Card className="w-full mx-auto pt-0 flex-col hover:bg-accent">
                            <CardHeader className="overflow-hidden p-0">
                                <AspectRatio ratio={16 / 9}>
                                    {experience.featured_image ? (
                                        <Suspense
                                            fallback={
                                                <ListExperiencesSkeleton />
                                            }
                                        >
                                            <Image
                                                src={experience.featured_image}
                                                alt={experience.title}
                                                fill={true}
                                                sizes="(min-width: 768px) 50vw, 100vw"
                                                className="rounded-t-md object-cover"
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
                            </CardHeader>
                            <CardContent className="px-4 group">
                                <div className="flex flex-row items-center w-full gap-2 justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-lg font-semibold group-hover:underline truncate">
                                            {experience.title}
                                        </h2>
                                        <p className="text-sm text-muted-foreground group-hover:underline truncate">
                                            {experience.subtitle}
                                        </p>
                                    </div>
                                    <div className="shrink-0 ml-2">
                                        <ChevronRight className="size-4" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
                {Array.from({ length: 16 }).map((_, index) => (
                    <ListExperiencesSkeleton key={index} />
                ))}
            </div>
        </div>
    );
}
