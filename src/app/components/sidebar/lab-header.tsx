import { AspectRatio } from "@/components/ui/aspect-ratio";
import { SidebarHeader } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { getExperienceDTO } from "@/data/dto/experience-dto";
import { Experience } from "@/types/api";
import Image from "next/image";
import { Suspense } from "react";

export default async function LabHeader({ slug }: { slug: string }) {
    const experience = (await getExperienceDTO(slug)) as Experience;
    return (
        <SidebarHeader className="flex flex-col items-start px-0 py-0">
            <AspectRatio ratio={16 / 9} className="relative w-full">
                <Suspense
                    fallback={
                        <Skeleton
                            className={"w-full h-full bg-primary rounded-none"}
                        />
                    }
                >
                    <Image
                        src={experience.featured_image}
                        alt={experience.title}
                        width={400}
                        height={400}
                        className="object-cover w-full h-full rounded-none"
                    />
                </Suspense>
            </AspectRatio>
            <div className={"px-5 pt-2 pb-4 flex flex-col gap-1"}>
                <h3 className="prose-h3 font-semibold">{experience.title}</h3>
                <p className="prose-muted text-muted-foreground">
                    {experience.subtitle}
                </p>
            </div>
        </SidebarHeader>
    );
}
