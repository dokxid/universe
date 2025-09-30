import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarHeader } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { getExperienceDTO } from "@/data/dto/experience-dto";
import { shimmerDataUrl } from "@/lib/utils/shimmer";
import { Experience } from "@/types/api";
import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";

export default async function LabHeader({ slug }: { slug: string }) {
    const experience = (await getExperienceDTO(slug)) as Experience;
    return (
        <SidebarHeader className="flex flex-col items-start px-0 py-0 gap-0">
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
                        height={225}
                        className="object-cover w-full h-full rounded-none"
                        placeholder={shimmerDataUrl(400, 225)}
                    />
                </Suspense>
            </AspectRatio>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div
                        className={
                            "px-5 py-4 flex flex-col gap-1 hover:cursor-pointer hover:bg-accent transition-all duration-200"
                        }
                    >
                        <div
                            className={
                                "flex flex-row items-center justify-between w-full"
                            }
                        >
                            <h3 className="prose-h3 font-semibold">
                                {experience.title}
                            </h3>
                            <EllipsisVertical />
                        </div>
                        <p className="prose-muted text-muted-foreground">
                            {experience.subtitle}
                        </p>
                        <p className="prose-muted my-1 text-xs text-muted-foreground line-clamp-5">
                            {experience.description}
                        </p>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={"start"} side={"right"}>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuItem>About us</DropdownMenuItem>
                    <DropdownMenuItem>Our Team</DropdownMenuItem>
                    <DropdownMenuItem>Contact us</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarHeader>
    );
}
