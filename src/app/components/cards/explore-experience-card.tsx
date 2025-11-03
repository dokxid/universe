import { ListLabsSkeleton } from "@/components/skeletons/list-experiences-skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { setSelectedLabParams } from "@/lib/utils/param-setter";
import { LabDTO } from "@/types/dtos";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { HostedImage } from "../embeds/s3-image";

export function ExploreLabCard({ lab }: { lab: LabDTO }) {
    const searchParams = useSearchParams();
    const selectedLab = searchParams.get("exp");

    return (
        <Card
            onClick={() =>
                setSelectedLabParams("/universe/map", searchParams, lab.slug)
            }
            key={lab.slug}
            data-testid={`explore-lab-card-${lab.slug}`}
            className={`w-full mx-auto py-0 flex-col hover:bg-accent shadow-none gap-0 h-60 group cursor-pointer ${lab.slug === selectedLab
                ? "bg-secondary text-secondary-foreground"
                : ""
                }`}
        >
            <div className="overflow-hidden rounded-t-md group-hover:h-6 shrink">
                <AspectRatio ratio={16 / 9}>
                    {lab.logo ? (
                        <Suspense fallback={<ListLabsSkeleton />}>
                            <HostedImage
                                fileName={lab.logo}
                                alt={lab.name}
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
                            {lab.name}
                        </h2>
                        <h3 className="text-sm text-muted-foreground line-clamp-1 group-hover:line-clamp-2">
                            {lab.subtitle}
                        </h3>
                        <p
                            className={
                                "text-xs text-muted-foreground line-clamp-1 group-hover:line-clamp-6 mt-0.5 group-hover:mt-4"
                            }
                        >
                            {lab.content}
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
