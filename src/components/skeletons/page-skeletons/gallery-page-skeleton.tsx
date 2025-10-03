import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-dropdown-menu";

export default function GalleryPageSkeleton() {
    return (
        <div className="w-full h-full flex px-4 lg:px-6">
            {/* Content skeleton */}
            <div className="flex flex-col gap-4 overflow-y-auto items-center max-w-6xl mx-auto w-full my-10">
                {/* Page title skeleton */}
                <div
                    className={
                        "flex flex-col lg:flex-row w-full items-start lg:items-center gap-6"
                    }
                >
                    <Skeleton className="size-[72px]" />
                    <div className={"flex flex-col gap-2"}>
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-6 w-96" />
                    </div>
                </div>

                <Separator className={"my-8"} />

                {/* filters skeleton */}
                <div className="flex flex-col lg:flex-row gap-2 w-full mb-6 justify-between">
                    <div className="w-full max-w-full lg:max-w-sm self-start mb-2 lg:mb-0">
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex flex-row gap-2">
                        <Skeleton className="size-10" />
                        <Skeleton className="size-10" />
                        <Skeleton className="h-10 w-4xs" />
                    </div>
                </div>

                {/* gallery grid skeleton */}
                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-48 w-full rounded-lg" />
                            <div className="space-y-6">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                            <Skeleton className="h-10 w-24" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
