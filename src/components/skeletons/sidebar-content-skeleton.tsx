import { Skeleton } from "@/components/ui/skeleton";

export function SidebarContentSkeleton() {
    return (
        <div className="h-full flex flex-col">
            {/* First Group - EXPLORE UNIVERSE */}
            <div className="py-2 gap-0.5">
                <Skeleton className="w-32 h-[14px] my-[5px]" />
                <div className="flex flex-col gap-0.5">
                    <Skeleton className="w-3/4 h-[20px] my-[6px]" />
                    <Skeleton className="w-3/4 h-[20px] my-[6px]" />
                    <Skeleton className="w-3/4 h-[20px] my-[6px]" />
                    <Skeleton className="w-1/2 h-[20px] my-[6px]" />
                </div>
            </div>
            <div className="py-2 gap-0.5">
                <Skeleton className="w-32 h-[14px] my-[5px]" />
                <div className="flex flex-col gap-0.5">
                    <Skeleton className="w-3/4 h-[20px] my-[6px]" />
                    <Skeleton className="w-3/4 h-[20px] my-[6px]" />
                    <Skeleton className="w-1/2 h-[20px] my-[6px]" />
                </div>
            </div>

            <div className="grow"></div>

            <div className="py-2 gap-0.5">
                <Skeleton className="w-32 h-[14px] my-[5px]" />
                <div className="flex flex-col gap-0.5">
                    <Skeleton className="w-1/2 h-[20px] my-[6px]" />
                    <Skeleton className="w-3/4 h-[20px] my-[6px]" />
                </div>
            </div>

            {/* user widget */}
        </div>
    );
}
