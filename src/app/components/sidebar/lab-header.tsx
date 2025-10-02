import { CopyLinkClipboard } from "@/app/components/embeds/copy-link-clipboard";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { SidebarHeader } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { shimmerDataUrl } from "@/lib/utils/shimmer";
import { Experience } from "@/types/dtos";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default function LabHeader({ experience }: { experience: Experience }) {
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
            <div className={"px-5 py-4 flex flex-col gap-1"}>
                <div
                    className={
                        "flex flex-row items-center justify-between w-full"
                    }
                >
                    <h3 className="text-[24px]/[1.2] font-bold mb-2">
                        {experience.title}
                        <CopyLinkClipboard link={experience.slug} />
                    </h3>
                </div>
                <p className="text-sm">{experience.subtitle}</p>
                <p className="my-1 text-xs line-clamp-5">
                    {experience.description}
                </p>
                <Link href={`/${experience.slug}/about`}>
                    <p className={"text-xs text-muted-foreground"}>
                        Read More
                        <ChevronRight
                            size={12}
                            className={"inline-block align-middle"}
                        />
                    </p>
                </Link>
            </div>
        </SidebarHeader>
    );
}
