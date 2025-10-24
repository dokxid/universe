import { ListLabsSkeleton } from "@/components/skeletons/list-experiences-skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { LabDTO } from "@/types/dtos";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export function ExperienceCard({ experience }: { experience: LabDTO }) {
    const url = `/${experience.slug}/map`;

    return (
        <Link
            key={experience.slug}
            href={url}
            prefetch={false}
            className="flex flex-row items-center w-full gap-2"
        >
            <Card
                key={experience.slug}
                className={`w-full mx-auto py-0 flex-col hover:bg-accent shadow-none gap-0 h-60 group`}
            >
                <div className="overflow-hidden rounded-t-md group-hover:h-6 shrink">
                    <AspectRatio ratio={16 / 9}>
                        {experience.logo ? (
                            <Suspense fallback={<ListLabsSkeleton />}>
                                <Image
                                    src={experience.logo}
                                    alt={experience.name}
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
                                {experience.name}
                            </h2>
                            <h3 className="text-sm text-muted-foreground line-clamp-1 group-hover:line-clamp-2">
                                {experience.subtitle}
                            </h3>
                            <p
                                className={
                                    "text-xs text-muted-foreground line-clamp-1 group-hover:line-clamp-6 mt-0.5 group-hover:mt-4"
                                }
                            >
                                {experience.content}
                            </p>
                        </div>
                        {/* <div className="shrink-0 ml-2">
                        <ChevronRight className="size-4" />
                    </div> */}
                    </div>
                </div>
            </Card>
        </Link>
    );
}
