import { SidebarContentSkeleton } from "@/components/skeletons/sidebar-content-skeleton";
import { UserWidgetAuthorizedSkeleton } from "@/components/skeletons/user-widget-skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { SidebarHeader } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function LabSidebarSkeleton() {
    return (
        <div className="flex flex-col h-full w-full max-w-[18rem] md:max-w-[17rem] bg-sidebar">
            <SidebarHeader className="flex flex-col items-start px-0 py-0 gap-0">
                {/* Featured Image Skeleton */}
                <AspectRatio ratio={16 / 9} className="relative w-full">
                    <Skeleton className="w-full h-full bg-primary rounded-none" />
                </AspectRatio>

                {/* Content Skeleton */}
                <div className="px-5 py-4 flex flex-col gap-1 w-full">
                    <div className="flex flex-col items-start justify-between w-full">
                        {/* Title Skeleton */}
                        <Skeleton className="w-3/4 h-7 mb-2" />
                        <Skeleton className="w-1/2 h-7 mb-2" />
                    </div>

                    {/* Subtitle Skeleton */}
                    <Skeleton className="w-full h-5 mb-1" />
                    <Skeleton className="w-1/2 h-5 mb-1" />

                    {/* Description Skeleton - 5 lines */}
                    <div className="my-1 flex flex-col gap-1.5">
                        <Skeleton className="w-full h-3" />
                        <Skeleton className="w-full h-3" />
                        <Skeleton className="w-full h-3" />
                        <Skeleton className="w-full h-3" />
                        <Skeleton className="w-4/5 h-3" />
                    </div>

                    {/* Read More Link Skeleton */}
                    <Skeleton className="w-20 h-3 mt-1" />
                </div>
            </SidebarHeader>
            <SidebarContentSkeleton />
            <UserWidgetAuthorizedSkeleton />
        </div>
    );
}
