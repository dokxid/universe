import { ListExperiencesSkeleton } from "@/components/skeletons/list-experiences-skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getExperiencesDTO } from "@/data/dto/experience-dto";
import { Experience } from "@/types/api";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export async function ListExperiencesDialog() {
    const experiences = await getExperiencesDTO();
    if (!experiences) return <div>No experiences found.</div>;

    return (
        <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
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
                                    <Image
                                        src={experience.featured_image}
                                        alt={experience.title}
                                        fill={true}
                                        sizes="(min-width: 768px) 50vw, 100vw"
                                        className="rounded-t-md object-cover"
                                    />
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
    );
}
